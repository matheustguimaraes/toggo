import json
from pathlib import Path

from django.core.management.base import BaseCommand

from chegados_api.models import SocialEvent


class Command(BaseCommand):
    help = "Import events from chegados_api/eventos_sympla.json"

    def handle(self, *args, **kwargs):
        json_path = Path(__file__).resolve().parent.parent.parent / "eventos_sympla.json"

        with open(json_path, encoding="utf-8") as f:
            events = json.load(f).get("events", [])

        created = 0
        for event in events:
            _, was_created = SocialEvent.objects.update_or_create(
                name=event["title"],
                location=event["location"],
                defaults={
                    "category": event.get("categoria"),
                    "link": event.get("link"),
                    "photo": event.get("img_url"),
                },
            )
            created += was_created

        self.stdout.write(self.style.SUCCESS(f"{created} new events, {len(events) - created} updated"))
