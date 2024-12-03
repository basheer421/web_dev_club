from django.contrib import admin
from .models import Project, Evaluation

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'submitted_by', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'description')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('project', 'evaluator', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
