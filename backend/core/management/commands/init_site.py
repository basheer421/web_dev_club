from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site

class Command(BaseCommand):
    help = 'Initialize the default site'

    def handle(self, *args, **options):
        Site.objects.update_or_create(
            id=1,
            defaults={
                'domain': 'localhost:8000',
                'name': 'DevClub'
            }
        )
        self.stdout.write(self.style.SUCCESS('Successfully initialized site')) 