from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize the application with necessary setup'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        # Initialize site
        self.stdout.write('Initializing site...')
        Site.objects.update_or_create(
            id=1,
            defaults={
                'domain': 'localhost:8000',
                'name': 'DevClub'
            }
        )
        self.stdout.write(self.style.SUCCESS('Site initialized successfully'))

        # Create superuser if it doesn't exist
        self.stdout.write('Creating superuser...')
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                'admin', 
                'admin@example.com', 
                'admin123'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        else:
            self.stdout.write('Superuser already exists') 