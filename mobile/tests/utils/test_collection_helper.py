from common.tests.core import SimpleTestCase
from mobile.utils.collection_helper import safe_get


class CollectionHelperTest(SimpleTestCase):
    def test_safe_get(self):
        lst = [1]

        safe_get(lst, 0, 0).should.be.equal(1)
        safe_get(lst, 2, 0).should.be.equal(0)
