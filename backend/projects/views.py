from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ValidationError
from .models import Project, ProjectSubmission, Evaluation
from .serializers import ProjectSerializer, ProjectSubmissionSerializer, EvaluationSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class ProjectSubmissionView(generics.CreateAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        try:
            project_id = request.data.get('project_id')
            if not project_id:
                return Response(
                    {"detail": "Project ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            github_repo = request.data.get('github_repo')
            if not github_repo:
                return Response(
                    {"detail": "GitHub repository URL is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Response(
                    {"detail": "Project not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            user = request.user
            
            # Check if user has a pending or completed submission for this project
            existing_submission = ProjectSubmission.objects.filter(
                project=project, 
                submitted_by=user,
                status__in=['pending', 'completed']
            ).exists()

            if existing_submission:
                return Response(
                    {"detail": "You have already submitted this project"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check level requirement
            if user.level < project.level_required:
                return Response(
                    {"detail": f"You need to be level {project.level_required} to submit this project"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            # Check points requirement
            if user.points < project.points_required:
                return Response(
                    {"detail": f"You need at least {project.points_required} points to submit this project"}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            # Create submission
            submission = ProjectSubmission.objects.create(
                project=project,
                submitted_by=user,
                github_repo=github_repo
            )

            # Deduct points
            user.points -= project.points_required
            user.save()

            serializer = self.get_serializer(submission)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"detail": "An unexpected error occurred"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EvaluationPoolView(generics.ListAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Exclude submissions by the current user and show only pending ones
        return ProjectSubmission.objects.filter(
            status='pending'
        ).exclude(
            submitted_by=self.request.user
        ).select_related(
            'project', 'submitted_by'
        )

class EvaluationView(generics.CreateAPIView):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        submission = ProjectSubmission.objects.get(pk=self.kwargs['pk'])
        
        if submission.submitted_by == self.request.user:
            raise ValidationError("You cannot evaluate your own submission")
            
        if submission.status != 'pending':
            raise ValidationError("This submission is already being evaluated")
        
        evaluation = serializer.save(
            evaluator=self.request.user,
            submission=submission
        )
        
        # Handle evaluation result
        if evaluation.is_approved:
            # If approved, mark as completed and level up the user
            submission.status = 'completed'
            submission.save()
            
            submitter = submission.submitted_by
            submitter.level += 1
            submitter.save()
        else:
            # If failed, mark as failed but keep the record
            submission.status = 'failed'
            submission.save()
        
        # Give points to evaluator
        self.request.user.points += 1
        self.request.user.save()

class EvaluationDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return ProjectSubmission.objects.get(pk=self.kwargs['pk'])

    def get(self, request, *args, **kwargs):
        submission = self.get_object()
        if (submission.status == 'pending'):
            submission_data = ProjectSubmissionSerializer(submission, context={'request': request}).data
            return Response({'submission': submission_data})
        else:
            return Response({'message': 'Submission is not pending'}, status=status.HTTP_404_NOT_FOUND)

class UserProjectSubmissionsView(generics.ListAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectSubmission.objects.filter(submitted_by=self.request.user)

class NextProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        next_project = Project.objects.filter(
            level_required__lte=user.level
        ).exclude(
            submissions__submitted_by=user,
            submissions__status__in=['pending', 'completed']
        ).order_by('level_required').first()

        if next_project:
            serializer = ProjectSerializer(next_project, context={'request': request})
            return Response(serializer.data)
        return Response({'message': 'No projects available'}, status=status.HTTP_404_NOT_FOUND)
