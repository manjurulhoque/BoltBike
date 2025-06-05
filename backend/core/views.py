from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from utils.response import api_response
from bikes.models import Bike
from bikes.serializers import BikeSerializer
from bikes.models import MaintenanceTicket
from bikes.serializers import MaintenanceTicketSerializer


class HomePageAPIView(APIView):
    """Home page view."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get the first 8 bikes
        bikes = Bike.objects.all()[:8]
        serializer = BikeSerializer(bikes, many=True)
        context = {
            "bikes": serializer.data,
        }
        return api_response(
            success=True,
            message="Home page fetched successfully",
            data=context,
            status_code=status.HTTP_200_OK,
        )

class MaintenanceTicketListCreateView(generics.ListCreateAPIView):
    serializer_class = MaintenanceTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_owner:
            return MaintenanceTicket.objects.filter(bike__owner=user)
        return MaintenanceTicket.objects.filter(reported_by=user)

    def perform_create(self, serializer):
        bike = get_object_or_404(Bike, pk=serializer.validated_data["bike_id"])
        serializer.save(reported_by=self.request.user)


class MaintenanceTicketDetailView(generics.RetrieveUpdateAPIView):
    queryset = MaintenanceTicket.objects.all()
    serializer_class = MaintenanceTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
