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
        query_str = build_query_string_from_session(session)
        (query_str in ['a=b&c=d', 'c=d&a=b']).should.be.true
