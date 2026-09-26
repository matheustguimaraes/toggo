from rest_framework import serializers
from django.contrib.auth import get_user_model

from chegados_api.models import SocialEvent, SocialEventLike, Participation


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
            "last_login",
            "date_joined",
        ]
        model = get_user_model()


class SocialEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = SocialEvent
        fields = "__all__"


class SocialEventLikeSerializer(serializers.ModelSerializer):
    event = SocialEventSerializer(read_only=True)

    class Meta:
        model = SocialEventLike
        fields = "__all__"


class ParticipationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participation
        fields = "__all__"


class ParticipationEventSerializer(serializers.ModelSerializer):
    event = SocialEventSerializer(read_only=True)

    class Meta:
        model = Participation
        fields = "__all__"
