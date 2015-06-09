from django.test.testcases import TestCase

from allegation.factories import ComplaintFactory


class AllegationApiTestBase(TestCase):
    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    def setUp(self):
        self.allegations = []
        for i in range(400):
            self.allegations.append(ComplaintFactory())
