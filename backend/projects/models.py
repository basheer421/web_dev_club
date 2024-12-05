from django.db import models
from users.models import User

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    pdf_file = models.FileField(upload_to='projects/pdfs/')
    points_required = models.IntegerField(default=1)
    level_required = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ProjectSubmission(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_evaluation', 'In Evaluation'),
        ('completed', 'Completed'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='submissions')
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_projects')
    github_repo = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project.title} by {self.submitted_by.username}"

class Evaluation(models.Model):
    submission = models.ForeignKey(ProjectSubmission, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations')
    comments = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for {self.submission}"

    def save(self, *args, **kwargs):
        # Update submission status when evaluation is created
        if not self.pk:  # New evaluation
            self.submission.status = 'in_evaluation'
            self.submission.save()
        super().save(*args, **kwargs)
