from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework import parsers
from django.contrib.auth import login, logout, get_user_model, authenticate
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)  # Exclude SessionAuthentication to avoid CSRF requirement
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)  # Exclude SessionAuthentication to avoid CSRF requirement
    serializer_class = UserLoginSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    def post(self, request):
        # Three-mode login endpoint:
        # 1. Face-based login: If face_image is provided with credentials
        # 2. Face validation: If only credentials are provided and user has face registered
        # 3. Simple login: If only credentials are provided and user has no face registered

        # Extract whether a face image was provided
        face_image = None
        if request.FILES:
            face_image = request.FILES.get('face_image')

        username = request.data.get('username')
        password = request.data.get('password')

        # Basic validation
        if not username or not password:
            return Response({
                'detail': 'username and password required',
                'received_data': request.data,
                'content_type': request.content_type
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response({'detail': 'User account is disabled.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user has face verification enabled
        has_face = bool(getattr(user, 'face_encoding', None) or getattr(user, 'face_image', None))

        # Case 1: User has face verification and provided face image
        if has_face and face_image:
            serializer = self.serializer_class(data=request.data, context={'request': request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.validated_data['user']

        # Case 2: User has face verification but no face image provided
        elif has_face and not face_image:
            return Response({
                'user': UserSerializer(user).data,
                'face_required': True,
                'message': 'Face verification required'
            }, status=status.HTTP_200_OK)

        # Case 3: Simple login (no face verification)
        # Issue token and return user data
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'face_required': has_face,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class FaceUploadView(APIView):
    """Authenticated endpoint to upload a reference face image for the user.

    The uploaded file field name should be `face_image`.
    """
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def post(self, request):
        face_image = request.FILES.get('face_image')
        if not face_image:
            return Response({'error': 'No face_image provided.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        try:
            from . import face_utils

            # CRITICAL: Create a copy of the file data before reading
            image_data = face_image.read()

            # Process the frame and get face encoding
            encoding, error = face_utils.process_webcam_frame(image_data)
            if error:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

            # RESET file pointer to beginning before saving
            face_image.seek(0)

            # Save the image and encoding
            user.face_image = face_image
            user.face_encoding = encoding
            user.face_verified = True
            user.save()

            return Response({
                'message': 'Face registered successfully.',
                'face_detected': True
            }, status=status.HTTP_200_OK)

        except ImportError:
            return Response({
                'error': 'Face recognition module not available'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            import traceback
            print(f"Face upload error: {str(e)}")
            print(traceback.format_exc())
            return Response({
                'error': f'Face processing error: {str(e)}',
                'face_detected': False
            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user