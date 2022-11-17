from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.models import AnonymousUser
from django.core import exceptions
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import generics, permissions, serializers, status, views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import BasicAuthentication

from .serializers import LabUserTypeSerializer, LoginSerializer, UserSerializer, LaboratorySerializer, LabMemberSerializer
from accounts.models import Laboratory, LabMember, LabUserType

User = get_user_model()

# class getLaboratory(APIView):
#     permission_classes = (permissions.AllowAny,)
#
#     def get(self, request, labName, *args, **kwargs):
#         laboratory = Laboratory.objects.filter(slug=labName).first()
#         if not laboratory:
#             Response({'detail': 'Laboratory not found.'}, status=status.HTTP_404_NOT_FOUND)
#         return Response({
#             'laboratory': LaboratorySerializer(laboratory, context={"request": request}).data,
#         }, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @method_decorator(never_cache)
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None
        if user:
            user = UserSerializer(user, context={"request": request}).data
            # return Response({'user': None, "laboratory": None}, status=status.HTTP_200_OK)
        labName = kwargs.get('labName')
        laboratory = Laboratory.objects.filter(slug=labName).first()
        if not laboratory:
            return Response({'detail': _(f'Laboratory "{labName}" not found.')}, status=status.HTTP_404_NOT_FOUND)
        if user:
            if laboratory.slug != request.session['laboratory'].get('slug'):
                return Response({
                'user': user,
                "laboratory": request.session['laboratory'],
                'detail': _(f"You are logged in {request.session['laboratory'].get('name')} laboratory not in {laboratory.name}.")
                }, status=status.HTTP_403_FORBIDDEN)
        return Response({
            'user': user,
            "laboratory": LaboratorySerializer(laboratory, context={"request": request}).data,
        }, status=status.HTTP_200_OK)

    # CALL LOGIN WITH GET METHOD BEFORE POST TO GET A CSRFToken
    @method_decorator(never_cache)
    @method_decorator(csrf_protect)
    def post(self, request, *args, **kwargs):
        labName = kwargs.get('labName')
        laboratory = Laboratory.objects.filter(slug=labName).first()
        if not laboratory:
            return Response({'detail': _(f'Laboratory "{labName}" not found.')}, status=status.HTTP_404_NOT_FOUND)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # if serializer.errors:
        #     raise serializers.ValidationError(serializer.errors)
        user = serializer.validated_data
        lab_member = LabMember.objects.filter(user=user, laboratory=laboratory).first()
        if user:
            if not lab_member or not lab_member.is_active:
                return Response({'detail': _('User not registered or active.')}, status=status.HTTP_403_FORBIDDEN)
            login(request, user)
            request.session['user'] = UserSerializer(user, context={"request": request}).data
            request.session['laboratory'] = LaboratorySerializer(laboratory, context={"request": request}).data
        else:
            raise serializers.ValidationError('Could not Login, try again.')
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            "laboratory": LaboratorySerializer(laboratory, context={"request": request}).data,
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    def get(self, request, *args, **kwargs):
        logout(request)
        return Response({}, status=status.HTTP_200_OK)

class UserView(generics.ListAPIView):
    # queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        print(self.kwargs)
        lab_id = self.request.session['laboratory'].get('id')
        laboratory = Laboratory.objects.filter(id=lab_id).first()
        queryset = User.objects.filter(labmember__laboratory=laboratory)
        return queryset

class LabUserTypeView(generics.ListAPIView):
    serializer_class = LabUserTypeSerializer

    def get_queryset(self):
        lab_id = self.request.session['laboratory'].get('id')
        laboratory = Laboratory.objects.filter(id=lab_id).first()
        queryset = LabUserType.objects.filter(laboratory=laboratory)
        return queryset

class LaboratoryView(generics.ListAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer

class LabMemberView(generics.ListAPIView):
    queryset = LabMember.objects.all()
    serializer_class = LabMemberSerializer
