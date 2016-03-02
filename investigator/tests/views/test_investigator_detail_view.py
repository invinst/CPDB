import json

from django.core.urlresolvers import reverse

from allegation.factories import InvestigatorFactory
from common.models import OfficerAllegation
from common.tests.core import SimpleTestCase


class InvestigatorDetailViewTestCase(SimpleTestCase):

    def setUp(self):
        self.investigator = InvestigatorFactory()

    def test_get_investigator(self):

        allegations = OfficerAllegation.objects.filter(allegation__investigator=self.investigator)
        disciplined = OfficerAllegation.disciplined.filter(allegation__investigator=self.investigator)
        response = self.client.get(
            reverse('investigator:detail',
                    kwargs={
                        'slug': self.investigator.slug,
                        'pk': self.investigator.id
                    }
                    )
        )

        response = json.loads(response.content.decode())

        response['investigator']['id'].should.equal(self.investigator.id)
        len(response['allegations']).should.equal(allegations.count())
        response['num_disciplined'].should.equal(disciplined.count())
        response.should.contain('timeline')
        response.should.contain('has_map')
