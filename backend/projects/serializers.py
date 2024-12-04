from rest_framework import serializers
from .models import Project, ProjectSubmission, Evaluation

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectSubmissionSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    submitted_by_username = serializers.CharField(source='submitted_by.username', read_only=True)
    points_required = serializers.IntegerField(source='project.points_required', read_only=True)

    class Meta:
        model = ProjectSubmission
        fields = [
            'id', 'project', 'project_title', 'submitted_by', 
            'submitted_by_username', 'github_repo', 'status', 
            'created_at', 'updated_at', 'points_required'
        ]
        read_only_fields = ('submitted_by', 'status')

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_username = serializers.CharField(source='evaluator.username', read_only=True)

    class Meta:
        model = Evaluation
        fields = ['id', 'submission', 'evaluator', 'evaluator_username', 
                 'comments', 'is_approved', 'created_at']
        read_only_fields = ('evaluator',) 