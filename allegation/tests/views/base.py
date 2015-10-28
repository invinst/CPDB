from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase


class AllegationApiTestBase(SimpleTestCase):
    _multiprocess_can_split_ = True
    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }

    def setUp(self):
        self.allegations = []
        for i in range(26):
            self.allegations.append(AllegationFactory())
