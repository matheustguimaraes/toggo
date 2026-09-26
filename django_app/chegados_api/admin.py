from django.contrib.admin import site

from chegados_api.models import SocialEvent, SocialEventLike, Participation

site.register(SocialEvent)
site.register(SocialEventLike)
site.register(Participation)
