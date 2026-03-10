from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UpdateProfileSerializer,
)


class AuthViewSet(viewsets.GenericViewSet):
    """
    ViewSet handling registration, login and logout.
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            profile = UserProfileSerializer(user, context={'request': request})
            return Response(
                {
                    'message': 'Account created successfully.',
                    'token': token.key,
                    'user': profile.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            profile = UserProfileSerializer(user, context={'request': request})
            return Response(
                {
                    'message': 'Login successful.',
                    'token': token.key,
                    'user': profile.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=['post'],
        url_path='logout',
        permission_classes=[IsAuthenticated],
    )
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response(
            {'message': 'Logged out successfully.'},
            status=status.HTTP_200_OK,
        )


class UserViewSet(viewsets.GenericViewSet):
    """
    ViewSet for user profile operations.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request):
        serializer = UserProfileSerializer(
            request.user, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='profile/update')
    def update_profile(self, request):
        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            updated = UserProfileSerializer(
                request.user, context={'request': request}
            )
            return Response(
                {'message': 'Profile updated.', 'user': updated.data}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)