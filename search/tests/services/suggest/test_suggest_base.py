from haystack.management.commands.rebuild_index import Command as RebuildIndexCommand

from common.models import Allegation, AllegationCategory, Officer
from common.tests.core import SimpleTestCase


class SuggestBaseTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()
        Allegation.objects.all().delete()

        self.cmd = RebuildIndexCommand()

    def rebuild_index(self):
        self.cmd.handle(interactive=False)

    class Meta:
        abstract = True
