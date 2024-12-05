from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import get_backends
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'csrfToken': get_token(request)})

    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            
            # Get or create token
            token, _ = Token.objects.get_or_create(user=user)
        
            # Login user
            backend = get_backends()[0]
            user.backend = f"{backend.__module__}.{backend.__class__.__name__}"
            login(request, user)
        
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        if 'profile_picture' in self.request.FILES:
            # Delete old profile picture if it exists
            if self.request.user.profile_picture:
                self.request.user.profile_picture.delete(save=False)
        serializer.save()

class UserSettingsView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Google login logic here
        pass

class UserApprovalView(APIView):
    permission_classes = [permissions.AllowAny]
    
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
