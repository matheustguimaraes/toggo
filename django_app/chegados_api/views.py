from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from chegados_api.models import Participation, SocialEvent, SocialEventLike
from chegados_api.serializers import (
    ParticipationEventSerializer,
    ParticipationSerializer,
    SocialEventSerializer,
    SocialEventLikeSerializer,
    UserSerializer,
)


def login_view(request):
    return render(request, "login.html")


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["username"]


class SocialEventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SocialEvent.objects.all()
    serializer_class = SocialEventSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id", "location"]


class SocialEventLikeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SocialEventLikeSerializer
    queryset = SocialEventLike.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["event"]

    def get_queryset(self):
        return SocialEventLike.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ParticipationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipationSerializer
    queryset = Participation.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["event", "user"]

    def get_queryset(self):
        return Participation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ParticipationEventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipationEventSerializer
    queryset = Participation.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["event", "user"]


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"error": "Todos os campos são obrigatórios"}, status=400)

    User = get_user_model()

    if User.objects.filter(username=username).exists():
        return Response({"error": "Usuário já existe"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email já está em uso"}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": "Usuário criado com sucesso"}, status=201)
