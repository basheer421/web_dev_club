from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserLoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        # Login logic here
        pass

class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class UserSettingsView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class GoogleLoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        # Google login logic here
        pass

class UserApprovalView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request, code):
        try:
            user = User.objects.get(approval_code=code, is_approved=False)
            user.is_approved = True
            user.save()
            return Response({'message': 'User approved successfully'})
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid approval code'},
                status=status.HTTP_400_BAD_REQUEST
            )
