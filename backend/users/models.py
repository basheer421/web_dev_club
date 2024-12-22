from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_approved = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    points = models.IntegerField(default=2)
    level = models.IntegerField(default=1)

    def __str__(self):
        return self.username
