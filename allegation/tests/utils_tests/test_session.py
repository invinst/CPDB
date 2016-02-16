from common.tests.core import SimpleTestCase
from share.factories import SessionFactory
from allegation.utils.session import build_query_string_from_session


class SessionUtilsTestCase(SimpleTestCase):
    def test_build_query_string_from_session(self):
        session = SessionFactory(query={
            'filters': {
                'bob': [{
                    'filter': 'a=b'
                }],
                'bib': [{
                    'category': 'c',
                    'value': 'd'
                }]
            }})
        build_query_string_from_session(session).should.equal('a=b&c=d')
