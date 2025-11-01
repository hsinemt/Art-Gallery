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

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            data['user'] = user
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        return data


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'user_type', 'bio', 'profile_picture', 'phone_number',
                  'date_of_birth', 'date_joined', 'is_superuser', 'is_staff')
        read_only_fields = ('id', 'date_joined', 'is_superuser', 'is_staff')


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