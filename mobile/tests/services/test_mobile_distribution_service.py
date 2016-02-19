from allegation.factories import OfficerFactory
from common.tests.core import SimpleTestCase
from mobile.services.officer_distribution_service import OfficerDistributionService


class MobileOfficerAllegationServiceTest(SimpleTestCase):
    def test_get_distribution(self):
        OfficerFactory(allegations_count=1)
        OfficerFactory.create_batch(2, allegations_count=3)

        distribution = OfficerDistributionService.get_distribution()

        distribution.should.be.equal([1, 0, 2])
