from django.conf import settings


def env_settings(_):
    return {
        'DJANGO_ENV': settings.DJANGO_ENV,
    }
