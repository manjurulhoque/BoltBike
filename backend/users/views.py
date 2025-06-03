from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from utils.response import api_response
from .serializers import SignupSerializer, UserSerializer


class SignupAPIView(APIView):
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
