from allegation.factories import InvestigatorFactory, AreaFactory
from common.tests.core import SimpleTestCase
from share.factories import SessionFactory


class SessionModelTestCase(SimpleTestCase):
    def setUp(self):
        self.session = SessionFactory()

    def test_readable_query(self):
        area = AreaFactory()
        investigator = InvestigatorFactory()
        self.session.query = {
            'filters': {
                'investigator': {
                    'value': [investigator.id],
                },
                'areas__id': {
                    'value': [area.id],
                },
            },
        }

        self.session.readable_query.should.equal({
            'investigator': [{
                'value': investigator.id,
                'text': investigator.name,
            }],
            'areas__id': [{
                'text': "%s: %s" % (area.type, area.name),
                'value': area.id
            }]
        })
