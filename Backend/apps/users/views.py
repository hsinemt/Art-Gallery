from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import login, logout, get_user_model
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

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Do not rely on session cookies for API auth; issue token only
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


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


class UserListView(generics.ListAPIView):
    # Allow any client to fetch the list of users (used by frontend to populate selectors)
    permission_classes = (permissions.AllowAny,)
    # No authentication required for listing users
    authentication_classes = ()
    serializer_class = UserSerializer
    queryset = User.objects.all()


class IsAdminView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request):
        return Response({
            'is_admin': request.user.is_staff
        })