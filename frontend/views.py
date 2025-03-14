from django.http import JsonResponse
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from rest_framework import status

from accounts.models import Laboratory, LabMember
from accounts.api.serializers import LaboratorySerializer, UserSerializer


def index(request, *args, **kwargs):
    # Pasar datos del context de Django a REACT
    print('estoy aqui')
    if request.user.is_authenticated:
        if not request.session.get('user'):
            request.session['user'] = UserSerializer(request.user, context={"request": request}).data
        if not request.session.get('laboratory'):
            labName = kwargs.get('labName')
            laboratory = Laboratory.objects.filter(slug=labName).first()
            if not laboratory:
                return JsonResponse({'detail': _(f'Laboratory "{labName}" not found.')}, status=status.HTTP_404_NOT_FOUND)
            lab_member = LabMember.objects.filter(user=request.user, laboratory=laboratory).first()
            if not lab_member or not lab_member.is_active:
                return JsonResponse({'detail': _('User not registered or active.')}, status=status.HTTP_403_FORBIDDEN)
            request.session['laboratory'] = LaboratorySerializer(laboratory, context={"request": request}).data
    context = {
        "user": request.session['user'] if request.user.is_authenticated else None,
        "laboratory": request.session['laboratory'] if request.user.is_authenticated else None,
    }

    return render(request, 'frontend/index.html', {"context": context})
