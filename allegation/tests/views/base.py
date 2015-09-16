from django.test.testcases import TestCase

from allegation.factories import AllegationFactory


class AllegationApiTestBase(TestCase):
    _multiprocess_can_split_ = True
    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    def setUp(self):
        self.allegations = []
        for i in range(26):
            self.allegations.append(AllegationFactory())
