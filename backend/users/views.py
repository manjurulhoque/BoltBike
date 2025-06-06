from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from utils.response import api_response
from utils.authentication import OptionalJWTAuthentication
from .serializers import (
    SignupSerializer, 
    UserSerializer, 
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)


class SignupAPIView(APIView):
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="User created successfully",
                data=serializer.data,
                status_code=status.HTTP_201_CREATED,
            )
        return api_response(
            success=False,
            message="User creation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class LoginAPIView(TokenObtainPairView):
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return api_response(
                success=False,
                message="Login failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        return api_response(
            success=True,
            message="Login successful",
            data=serializer.validated_data,
            status_code=status.HTTP_200_OK,
        )


class TokenRefreshAPIView(TokenRefreshView):
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return api_response(
                success=False,
                message="Token refresh failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return api_response(
            success=True,
            message="Token refreshed successfully",
            data=serializer.validated_data,
            status_code=status.HTTP_200_OK,
        )


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return api_response(
            success=True,
            message="User fetched successfully",
            data=serializer.data,
        )


class PasswordResetRequestAPIView(APIView):
    """Request password reset email."""
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="If an account with this email exists, a password reset link has been sent.",
                data=None,
                status_code=status.HTTP_200_OK,
            )
        return api_response(
            success=False,
            message="Invalid email address",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class PasswordResetConfirmAPIView(APIView):
    """Confirm password reset with token."""
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            # Validate token and uid
            try:
                user = serializer.validate_token_and_uid(uid, token)
                serializer.save()
                return api_response(
                    success=True,
                    message="Password has been reset successfully",
                    data=None,
                    status_code=status.HTTP_200_OK,
                )
            except Exception as e:
                return api_response(
                    success=False,
                    message=str(e),
                    data=None,
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        return api_response(
            success=False,
            message="Invalid data",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )
