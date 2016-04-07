from django.apps import AppConfig


class CommonConfig(AppConfig):
    name = 'common'
    verbose_name = 'Common'

    def ready(self):
        import common.signals.handlers  # NOQA
