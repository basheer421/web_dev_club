from django.urls import path
from . import views

app_name = 'projects'

urlpatterns = [
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('my-submissions/', views.UserProjectSubmissionsView.as_view(), name='my-submissions'),
    path('submit/', views.ProjectSubmissionView.as_view(), name='submit'),
    path('pool/', views.EvaluationPoolView.as_view(), name='evaluation-pool'),
    path('evaluation/<int:pk>/', views.EvaluationDetailView.as_view(), name='evaluation-detail'),
    path('evaluate/<int:pk>/', views.EvaluationView.as_view(), name='evaluate'),
    path('next/', views.NextProjectView.as_view(), name='next-project'),
] 