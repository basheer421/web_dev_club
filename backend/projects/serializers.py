from rest_framework import serializers
from .models import Project, ProjectSubmission, Evaluation
from users.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'pdf_file', 'points_required', 'level_required', 'created_at', 'updated_at']

class ProjectSubmissionSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    submitted_by = UserSerializer(read_only=True)

    class Meta:
        model = ProjectSubmission
        fields = ['id', 'project', 'submitted_by', 'github_repo', 'status', 'created_at', 'updated_at']
        read_only_fields = ('submitted_by', 'status')

    def create(self, validated_data):
        return ProjectSubmission.objects.create(**validated_data)

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_username = serializers.CharField(source='evaluator.username', read_only=True)

    class Meta:
        model = Evaluation
        fields = ['id', 'submission', 'evaluator', 'evaluator_username', 
                 'comments', 'is_approved', 'created_at']
        read_only_fields = ('evaluator', 'submission') 