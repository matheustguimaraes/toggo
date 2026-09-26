from django.db import models
from django.conf import settings


class SocialEvent(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.TextField(blank=True, null=True)
    category = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    link = models.TextField(blank=True, null=True)
    scheduled_begin_at = models.DateField(blank=True, null=True)
    scheduled_end_at = models.DateField(blank=True, null=True)
    photo = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.id} - {self.name} - {self.category} - {self.scheduled_begin_at} - {self.created_at}"


class SocialEventLike(models.Model):
    id = models.BigAutoField(primary_key=True)
    event = models.ForeignKey(SocialEvent, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.id} - {self.event.name} - {self.created_at}"


class Participation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(SocialEvent, on_delete=models.CASCADE)
    confirmed_at = models.DateTimeField(auto_now_add=True)
    user_rating = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "event")

    def __str__(self):
        return f"{self.id} - {self.event.name} - {self.confirmed_at} - {self.user.username}"
