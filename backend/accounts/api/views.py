import json
from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.core import exceptions
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import generics, permissions, serializers, status, views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.api.permissions import CreateRetrieveUpdateDestroyPermission, REQ_PERMS
from accounts.api.serializers import LoginSerializer, UserSerializer, UserListSerializer

User = get_user_model()

class CheckPerms(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        entity = request.GET.get("entity")  
        has_perms = {key: False for key in ["add", "change", "delete", "view"]}
        if entity in REQ_PERMS:
            user_perms = set(request.user.get_all_permissions())  # Permisos del usuario en Django
            for key in has_perms:
                has_perms[key] = all(perm in user_perms for perm in REQ_PERMS[entity].get(key,[]))
        print(has_perms)
        return Response({"has_perms": has_perms})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'user': None}, status=status.HTTP_200_OK)
        return Response({'user': UserSerializer(request.user, context={"request": request}).data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data # Authenticated in serilizer.validate()
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                }, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Bad credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.headers.get("X-Refresh")  
            if not refresh_token:
                return Response({"detail": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()  
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
class ListCreateView(generics.ListCreateAPIView):
    queryset = User.active.all()
    serializer_class = UserListSerializer
    permission_classes = [CreateRetrieveUpdateDestroyPermission]

class RetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.active.all()
    lookup_field = 'id'
    serializer_class = UserSerializer
    permission_classes = [CreateRetrieveUpdateDestroyPermission]

    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.is_active = False
        obj.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def get(self, request, *args, **kwargs):
    #     can_edit = request.user.has_perm('app.change_form')
    #     response = super().get(request, *args, **kwargs)
    #     response.data['can_edit'] = can_edit
    #     return response


# class UserView(generics.ListAPIView):
#     # queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def get_queryset(self):
#         print(self.kwargs)
#         lab_id = self.request.session['lab_member'].get('laboratory').get('id')
#         laboratory = Laboratory.objects.filter(id=lab_id).first()
#         queryset = User.objects.filter(labmember__laboratory=laboratory)
#         return queryset

# class LabUserTypeView(generics.ListAPIView):
#     serializer_class = LabUserTypeSerializer

#     def get_queryset(self):
#         lab_id = self.request.session['lab_member'].get('laboraory').get('id')
#         laboratory = Laboratory.objects.filter(id=lab_id).first()
#         queryset = LabUserType.objects.filter(laboratory=laboratory)
#         return queryset

# class LaboratoryView(generics.ListAPIView):
#     queryset = Laboratory.objects.all()
#     serializer_class = LaboratorySerializer

# class LabMemberView(generics.ListAPIView):
#     queryset = LabMember.objects.all()
#     serializer_class = LabMemberSerializer

# class LabMemberListView(generics.ListAPIView):
#     serializer_class = LabMemberSerializer
#     permission_classes = [ListCreatePermission]

#     def get_queryset(self):
#         laboratory_id = self.request.session.get('lab_member').get('laboratory').get('id')
#         queryset = LabMember.objects.filter(laboratory__id=laboratory_id)
#         return queryset
    

# class LabMemberDetailView(generics.RetrieveUpdateAPIView):
#     lookup_field = 'id'
#     serializer_class = LabMemberSerializer
#     permission_classes = [RetrieveUpdateDestroyPermission]
#     parser_classes = [MultiPartParser, FormParser, JSONParser]

#     def get_queryset(self):
#         laboratory_id = self.request.session.get('lab_member').get('laboratory').get('id')
#         queryset = LabMember.objects.filter(laboratory__id=laboratory_id)
#         return queryset
    
#     def get_serializer_context(self):
#         laboratory_id = self.request.session.get('lab_member').get('laboratory').get('id')
#         context = super().get_serializer_context()
#         context.update({"laboratory_id": laboratory_id})
#         return context
    
    # def put(self, request, *args, **kwargs):
    #     print('PUT METHOD', request.data)
    #     return super().put(request, *args, **kwargs)



