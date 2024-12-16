from rest_framework import serializers
from .models import Project, ProjectSubmission, Evaluation
from users.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'pdf_file', 'points_required', 'level_required', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.pdf_file:
            data['pdf_file'] = request.build_absolute_uri(instance.pdf_file.url)
        return data

class ProjectSubmissionSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    submitted_by = UserSerializer(read_only=True)
    project_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ProjectSubmission
        fields = ['id', 'project', 'project_id', 'submitted_by', 'github_repo', 'status', 'created_at', 'updated_at']
        read_only_fields = ('submitted_by', 'status', 'project')

    def create(self, validated_data):
        project_id = validated_data.pop('project_id')
        project = Project.objects.get(id=project_id)
        return ProjectSubmission.objects.create(project=project, **validated_data)

class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_username = serializers.CharField(source='evaluator.username', read_only=True)

    class Meta:
        model = Evaluation
        fields = ['id', 'submission', 'evaluator', 'evaluator_username', 
                 'comments', 'is_approved', 'created_at']
        read_only_fields = ('evaluator', 'submission') 