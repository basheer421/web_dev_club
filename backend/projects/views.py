from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ValidationError
from .models import Project, Evaluation
from .serializers import ProjectSerializer, EvaluationSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Create your views here.

class ProjectListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectSubmissionView(generics.CreateAPIView):
    serializer_class = ProjectSerializer
    
    def perform_create(self, serializer):
        if self.request.user.points < 1:
            raise ValidationError("You need at least 1 point to submit a project")
        self.request.user.points -= 1
        self.request.user.save()
        serializer.save(submitted_by=self.request.user)

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EvaluationPoolView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer
    
    def get_queryset(self):
        return Project.objects.filter(status='pending')

class EvaluationView(generics.CreateAPIView):
    serializer_class = EvaluationSerializer
    
    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['pk'])
        serializer.save(
            evaluator=self.request.user,
            project=project
        )
        self.request.user.points += 1
        self.request.user.save()

class EvaluationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
