from common.utils.haystack import rebuild_index

from common.models import Allegation, AllegationCategory, Officer
from common.tests.core import SimpleTestCase


class BaseSuggestTestCase(SimpleTestCase):
    def setUp(self):
        AllegationCategory.objects.all().delete()
        Officer.objects.all().delete()
        Allegation.objects.all().delete()

    def rebuild_index(self):
        rebuild_index()

    class Meta:
        abstract = True
