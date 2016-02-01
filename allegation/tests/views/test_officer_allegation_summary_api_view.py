from allegation.tests.views.base import OfficerAllegationApiTestBase
from allegation.factories import (
    OfficerAllegationFactory, AllegationCategoryFactory)


class OfficerAllegationSummaryApiViewTestCase(OfficerAllegationApiTestBase):
    def setUp(self):
        self.officer_allegation = OfficerAllegationFactory()

    def test_get_summary(self):
        AllegationCategoryFactory()

        response = self.client.get('/api/officer-allegations/summary/')

        data = self.json(response)
        data.should.contain("summary")

        isinstance(data['summary'], list).should.be.true
        data['summary'].should.have.length_of(1)
        data['summary'][0]['name'].should.equal(
            self.officer_allegation.cat.category)
