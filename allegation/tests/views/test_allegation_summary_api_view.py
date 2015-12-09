import json

from allegation.tests.views.base import AllegationApiTestBase
from allegation.factories import AllegationFactory, AllegationCategoryFactory


class AllegationSummaryApiViewTestCase(AllegationApiTestBase):
    def setUp(self):
        self.allegation = AllegationFactory()

    def test_get_summary(self):
        cat = AllegationCategoryFactory()

        response = self.client.get('/api/allegations/summary/')

        data = self.json(response)
        data.should.contain("summary")

        isinstance(data['summary'], list).should.be.true
        data['summary'].should.have.length_of(1)
        data['summary'][0]['name'].should.equal(self.allegation.cat.category)
