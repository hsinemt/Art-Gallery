from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    user_type = serializers.ChoiceField(
        choices=[ ('user', 'I Am User') , ('artist', 'I Am Artist')],
        default='user',
        help_text="Select user type: artist or user"
    )
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name',
                  'last_name', 'user_type', 'bio', 'phone_number', 'date_of_birth')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate_user_type(self, value):
        """Prevent users from registering as admin via API"""
        if value == 'admin':
            raise serializers.ValidationError(
                "Cannot register as admin. Admin users must be created by system administrators.")
        if value not in ['artist', 'user']:
            raise serializers.ValidationError("User type must be 'artist' or 'user'.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})

        # Ensure user_type is provided and valid
        if 'user_type' not in attrs:
            attrs['user_type'] = 'user'  # Default to regular user

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    # When a user has a registered face_encoding, the client should submit
    # a `face_image` during login for face verification.
    face_image = serializers.ImageField(required=False, write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            # If user has registered a face (encoding or saved face_image), require a face image and verify it here.
            face_image = None
            if self.context.get('request'):
                face_image = self.context['request'].FILES.get('face_image')
            if getattr(user, 'face_encoding', None) or getattr(user, 'face_image', None):
                if not face_image:
                    raise serializers.ValidationError('Face image required for this account.')
                try:
                    from . import face_utils
                except Exception:
                    raise serializers.ValidationError('Server face verification not available. Please contact admin.')

                # Choose verification method: prefer stored encoding, else use stored image file
                stored = getattr(user, 'face_encoding', None)
                if not stored:
                    # pass stored image path or file-like object
                    stored = getattr(user, 'face_image')

                try:
                    verified = face_utils.verify_face_against_encoding(stored, face_image)
                except Exception as e:
                    raise serializers.ValidationError({'face_verification': str(e)})

                if not verified:
                    raise serializers.ValidationError('Face verification failed.')

            data['user'] = user
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'user_type', 'bio', 'profile_picture', 'phone_number',
                  'date_of_birth', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value