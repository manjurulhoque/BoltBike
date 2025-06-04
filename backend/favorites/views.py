from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from .models import Favorite
from .serializers import FavoriteSerializer, CreateFavoriteSerializer
from bikes.models import Bike
from utils.response import api_response


class FavoriteListView(generics.ListAPIView):
    """List user's favorites"""
    
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return api_response(
            success=True,
            message="Favorites retrieved successfully",
            data={
                'count': queryset.count(),
                'results': serializer.data
            },
            status_code=status.HTTP_200_OK
        )


class FavoriteCreateView(generics.CreateAPIView):
    """Add a bike to favorites"""
    
    serializer_class = CreateFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                favorite = serializer.save()
                response_serializer = FavoriteSerializer(favorite)
                
                return api_response(
                    success=True,
                    message="Bike added to favorites successfully",
                    data=response_serializer.data,
                    status_code=status.HTTP_201_CREATED
                )
            except IntegrityError:
                return api_response(
                    success=False,
                    message="This bike is already in your favorites",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        
        return api_response(
            success=False,
            message="Invalid data provided",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class FavoriteDeleteView(APIView):
    """Remove a bike from favorites"""
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, bike_id):
        try:
            bike = get_object_or_404(Bike, id=bike_id)
            favorite = get_object_or_404(Favorite, user=request.user, bike=bike)
            favorite.delete()
            
            return api_response(
                success=True,
                message="Bike removed from favorites successfully",
                status_code=status.HTTP_200_OK
            )
        
        except Favorite.DoesNotExist:
            return api_response(
                success=False,
                message="This bike is not in your favorites",
                status_code=status.HTTP_404_NOT_FOUND
            )


class FavoriteStatusView(APIView):
    """Check if a bike is in user's favorites"""
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, bike_id):
        try:
            bike = get_object_or_404(Bike, id=bike_id)
            is_favorited = Favorite.objects.filter(user=request.user, bike=bike).exists()
            
            return api_response(
                success=True,
                message="Favorite status retrieved successfully",
                data={'is_favorite': is_favorited},
                status_code=status.HTTP_200_OK
            )
        
        except Bike.DoesNotExist:
            return api_response(
                success=False,
                message="Bike not found",
                status_code=status.HTTP_404_NOT_FOUND
            )


class FavoriteToggleView(APIView):
    """Toggle favorite status of a bike"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, bike_id):
        try:
            bike = get_object_or_404(Bike, id=bike_id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                bike=bike
            )
            
            if created:
                return api_response(
                    success=True,
                    message="Bike added to favorites successfully",
                    data={'is_favorite': True},
                    status_code=status.HTTP_201_CREATED
                )
            else:
                favorite.delete()
                return api_response(
                    success=True,
                    message="Bike removed from favorites successfully",
                    data={'is_favorite': False},
                    status_code=status.HTTP_200_OK
                )
        
        except Bike.DoesNotExist:
            return api_response(
                success=False,
                message="Bike not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
