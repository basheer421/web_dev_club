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
    
    def perform_create(self, serializer):
        project = serializer.validated_data['project']
        if self.request.user.points < project.points_required:
            raise ValidationError(f"You need at least {project.points_required} points to submit this project")
        
        self.request.user.points -= project.points_required
        self.request.user.save()
        serializer.save(submitted_by=self.request.user)

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EvaluationPoolView(generics.ListAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProjectSubmission.objects.filter(status='pending')

class EvaluationView(generics.CreateAPIView):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        submission = ProjectSubmission.objects.get(pk=self.kwargs['pk'])
        
        # Check if user is trying to evaluate their own submission
        if submission.submitted_by == self.request.user:
            raise ValidationError("You cannot evaluate your own submission")
            
        if submission.status != 'pending':
            raise ValidationError("This submission is already being evaluated")
        
        evaluation = serializer.save(
            evaluator=self.request.user,
            submission=submission
        )
        
        # Update submission status based on evaluation
        submission.status = 'completed' if evaluation.is_approved else 'pending'
        submission.save()
        
        if evaluation.is_approved:
            # Increase submitter's level
            submitter = submission.submitted_by
            submitter.level += 1
            submitter.save()
        
        # Give points to evaluator
        self.request.user.points += 1
        self.request.user.save()

        return Response(EvaluationSerializer(evaluation).data)

class EvaluationDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return ProjectSubmission.objects.get(pk=self.kwargs['pk'])

class UserProjectSubmissionsView(generics.ListAPIView):
    """List all submissions by the current user"""
    serializer_class = ProjectSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectSubmission.objects.filter(submitted_by=self.request.user)
