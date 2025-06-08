from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "password2",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "profile_photo",
        )
        read_only_fields = ("id",)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information."""

    class Meta:
        model = User
        fields = ("first_name", "last_name", "phone", "profile_photo")
        
    def validate_phone(self, value):
        """Validate phone number format."""
        if value and len(value.strip()) > 0:
            # Basic phone validation - you can make this more strict
            if len(value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '').replace('+', '')) < 5:
                raise serializers.ValidationError("Phone number must be at least 5 digits.")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset."""

    email = serializers.EmailField()

    def validate_email(self, value):
        """Check if user with this email exists."""
        try:
            user = User.objects.get(email=value)
            self.context['user'] = user
            return value
        except User.DoesNotExist:
            # Don't reveal if email exists or not for security
            return value

    def save(self):
        """Send password reset email."""
        user = self.context.get('user')
        if not user:
            # Don't send email if user doesn't exist, but don't reveal this
            return

        # Generate token and uid
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Create reset link (you can customize this URL)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        reset_url = f"{frontend_url}/reset-password/{uid}/{token}/"

        # Email content
        subject = 'Reset Your Password - eBikeRent'
        
        # HTML email template (you can create this later)
        html_message = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hello {user.get_full_name()},</p>
            <p>You have requested to reset your password for your eBikeRent account.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{reset_url}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <br>
            <p>Best regards,<br>The eBikeRent Team</p>
        </body>
        </html>
        """
        
        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log the error in production
            print(f"Failed to send password reset email: {e}")


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset."""

    new_password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        """Validate that passwords match."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {"new_password_confirm": "Password fields didn't match."}
            )
        return attrs

    def validate_token_and_uid(self, uid, token):
        """Validate the reset token and uid."""
        try:
            # Decode the uid
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            # Check if token is valid
            if not default_token_generator.check_token(user, token):
                raise serializers.ValidationError("Invalid or expired reset link.")
            
            self.context['user'] = user
            return user
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid reset link.")

    def save(self):
        """Set new password for the user."""
        user = self.context['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
