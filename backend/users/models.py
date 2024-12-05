from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    points = models.IntegerField(default=3)
    level = models.IntegerField(default=1)
    is_approved = models.BooleanField(default=False)
    approval_code = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    google_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username
