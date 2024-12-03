from django.db import models
from users.models import User

class Project(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_evaluation', 'In Evaluation'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    pdf_file = models.FileField(upload_to='project_pdfs/')
    github_repo = models.URLField()
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_projects')
    evaluator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='evaluating_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Evaluation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='evaluations')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE)
    comments = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for {self.project.title}"
