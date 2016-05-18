from django.core.management import BaseCommand

from api.models import InterfaceText


class Command(BaseCommand):
    def handle(self, *args, **options):
        InterfaceText(key='thank-you-message', text='Someone from our team will write a Freedom of Information Act '
                                                    'Request for this document, and e-mail FOIA@chicagopolice.org. '
                                                    'We will wait to hear back. \nIf we receive a responsive document, '
                                                    'we will update this database. Check back in a few weeks!').save()
