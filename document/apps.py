from django.apps import AppConfig


class DocumentConfig(AppConfig):
    name = 'document'
    verbose_name = 'Document'

    def ready(self):
        import document.signals.handlers  # NOQA
