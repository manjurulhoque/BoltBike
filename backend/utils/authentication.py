from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser


class OptionalJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that doesn't fail on invalid tokens.
    This allows public endpoints to work even with expired/invalid tokens.
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError):
            # If token is invalid/expired, treat as anonymous user
            # This allows AllowAny permissions to work properly
            return None
        except Exception:
            # For any other authentication errors, also treat as anonymous
            return None
