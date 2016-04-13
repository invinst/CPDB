from common.tests.core import SimpleTestCase
from common.utils.mobile_url_hash_util import MobileUrlHashUtil


class MobileUrlHashUtilTest(SimpleTestCase):
    def setUp(self):
        self.manager = MobileUrlHashUtil()

    def test_encode(self):
        self.manager.encode(123).should.be.equal('pJ84j3ME')

    def test_decode(self):
        hash = 'KJeZ1BMz'
        self.manager.decode(hash).should.be.equal(436)
