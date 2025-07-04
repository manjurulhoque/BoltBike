# Generated by Django 5.0.10 on 2025-06-04 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Bike",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("title", models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("location", models.CharField(max_length=255)),
                (
                    "hourly_rate",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("daily_rate", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "bike_type",
                    models.CharField(
                        choices=[
                            ("city", "City"),
                            ("mountain", "Mountain"),
                            ("road", "Road"),
                            ("cargo", "Cargo"),
                            ("folding", "Folding"),
                            ("hybrid", "Hybrid"),
                        ],
                        default="city",
                        max_length=20,
                    ),
                ),
                (
                    "battery_range",
                    models.PositiveIntegerField(
                        help_text="Battery range in kilometers"
                    ),
                ),
                (
                    "max_speed",
                    models.PositiveIntegerField(help_text="Maximum speed in km/h"),
                ),
                (
                    "weight",
                    models.DecimalField(
                        decimal_places=2, help_text="Weight in kilograms", max_digits=5
                    ),
                ),
                ("features", models.JSONField(blank=True, default=list)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("available", "Available"),
                            ("unavailable", "Unavailable"),
                            ("maintenance", "Maintenance"),
                        ],
                        default="available",
                        max_length=20,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="BikeImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("image", models.ImageField(upload_to="bike_images/")),
                (
                    "alt_text",
                    models.CharField(
                        blank=True,
                        help_text="Alternative text for accessibility",
                        max_length=255,
                    ),
                ),
                (
                    "caption",
                    models.CharField(
                        blank=True, help_text="Image caption", max_length=255
                    ),
                ),
                (
                    "is_primary",
                    models.BooleanField(
                        default=False, help_text="Is this the primary/featured image"
                    ),
                ),
                (
                    "order",
                    models.PositiveIntegerField(
                        default=0, help_text="Display order of the image"
                    ),
                ),
            ],
            options={
                "ordering": ["-is_primary", "order", "created_at"],
            },
        ),
        migrations.CreateModel(
            name="MaintenanceTicket",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("description", models.TextField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("open", "Open"),
                            ("in_progress", "In Progress"),
                            ("resolved", "Resolved"),
                        ],
                        default="open",
                        max_length=20,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
