from datetime import datetime

from allegation.factories import AllegationFactory
from common.tests.core import SimpleTestCase
from dashboard.admin import AllegationResource


class AllegationResourceTestCase(SimpleTestCase):
    def setUp(self):
        self.allegation = AllegationFactory(document_id=None)

    def test_dehydrate_status(self):
        self.allegation.document_requested = None
        AllegationResource().dehydrate_status(self.allegation).should.equal('Missing')

        self.allegation.document_requested = True
        self.allegation.document_pending = True
        AllegationResource().dehydrate_status(self.allegation).should.equal('Pending')

        self.allegation.document_pending = False
        AllegationResource().dehydrate_status(self.allegation).should.equal('Request')

        self.allegation.document_id = 1
        AllegationResource().dehydrate_status(self.allegation).should.equal('Fulfilled')

    def test_dehydrate_last_requested(self):
        expected_result = '11:12 AM, 09 Oct 2015'

        self.allegation.last_requested = datetime(day=9, month=10, year=2015, hour=11, minute=12)
        result = AllegationResource().dehydrate_last_requested(self.allegation)

        result.should.equal(expected_result)
