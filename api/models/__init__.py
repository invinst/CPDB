from django.db import models

from officer.models import Story


DEFAULT_SITE_TITLE = 'Police Misconduct in Chicago'


def _default_story_types_order():
    return ",".join(Story.objects.all().values_list('story_type', flat=True).distinct())


class Setting(models.Model):
    default_site_title = models.CharField(max_length=255, default=DEFAULT_SITE_TITLE)
    story_types_order = models.TextField(default=_default_story_types_order)

    DEFAULT_SITE_TITLE = DEFAULT_SITE_TITLE

    @classmethod
    def _default_story_types_order(cls):
        return _default_story_types_order()
