from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from bikes.models import Bike
from .models import MaintenanceTicket
from .serializers import MaintenanceTicketSerializer
from .permissions import IsMaintenanceReporterOrBikeOwner


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
    permission_classes = [permissions.IsAuthenticated, IsMaintenanceReporterOrBikeOwner]

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj
