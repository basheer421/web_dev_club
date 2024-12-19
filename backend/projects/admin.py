from django.contrib import admin
from .models import Project, ProjectSubmission, Evaluation

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'points_required', 'created_at')
    search_fields = ('title', 'description', 'evaluation_markdown')

@admin.register(ProjectSubmission)
class ProjectSubmissionAdmin(admin.ModelAdmin):
    list_display = ('project', 'submitted_by', 'status', 'created_at')
    list_filter = ('status', 'project')
    search_fields = ('project__title', 'submitted_by__username')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ("submission", "evaluator", "is_approved", "created_at")
    list_filter = ("is_approved",)
    search_fields = ("submission__project__title", "evaluator__username")
