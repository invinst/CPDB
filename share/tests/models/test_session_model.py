from allegation.factories import InvestigatorFactory
from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SessionModelTestCase(SimpleTestCase):
    def setUp(self):
        self.session = SessionFactory()

    def test_readable_query(self):
        investigator = InvestigatorFactory()
        self.session.query = {
            'investigator': {
                'value': [investigator.id],
            },
        }

        self.session.readable_query.should.equal({
            'investigator': [{
                'value': investigator.id,
                'text': investigator.name,
            }]
        })