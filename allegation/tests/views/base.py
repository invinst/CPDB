from common.tests.core import SimpleTestCase


class OfficerAllegationApiTestBase(SimpleTestCase):
    _multiprocess_can_split_ = True
    _overridden_settings = {
        'ALLEGATION_LIST_ITEM_COUNT': 10,
    }
