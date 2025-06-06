from django.core.management.base import BaseCommand
from django.utils import timezone
from bookings.models import Booking, BookingStatus


class Command(BaseCommand):
    help = 'Update booking statuses based on current time'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be updated without making changes',
        )

    def handle(self, *args, **options):
        current_time = timezone.now()
        dry_run = options['dry_run']
        
        # Count updates
        started_count = 0
        completed_count = 0
        
        # Auto-start approved bookings that should be active
        approved_bookings = Booking.objects.filter(
            status=BookingStatus.APPROVED,
            start_time__lte=current_time
        ).select_related('bike', 'renter')
        
        for booking in approved_bookings:
            if not dry_run:
                booking.status = BookingStatus.ACTIVE
                booking.save()
            started_count += 1
            self.stdout.write(
                f"{'[DRY RUN] ' if dry_run else ''}Started rental #{booking.id} - {booking.bike.title}"
            )
        
        # Auto-complete active bookings that have ended
        active_bookings = Booking.objects.filter(
            status=BookingStatus.ACTIVE,
            end_time__lte=current_time
        ).select_related('bike', 'renter')
        
        for booking in active_bookings:
            if not dry_run:
                booking.status = BookingStatus.COMPLETED
                booking.save()
            completed_count += 1
            self.stdout.write(
                f"{'[DRY RUN] ' if dry_run else ''}Completed rental #{booking.id} - {booking.bike.title}"
            )
        
        # Summary
        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"DRY RUN: Would start {started_count} rentals and complete {completed_count} rentals"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully started {started_count} rentals and completed {completed_count} rentals"
                )
            )
        
        if started_count == 0 and completed_count == 0:
            self.stdout.write(self.style.SUCCESS("No bookings needed status updates")) 