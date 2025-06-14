# Generated by Django 5.0.10 on 2025-06-04 13:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("bookings", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="renter",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="rentals",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
