from common.utils.hashid import hash_obj
from search.factories import SessionAliasFactory
from search.services.suggest.suggest_session_alias import SuggestSessionAlias
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestSessionAliasTestCase(SuggestBaseTestCase):
    def test_suggest_session_alias(self):
        session_alias = SessionAliasFactory(alias='skullcap')

        self.rebuild_index()

        expect_suggestion = session_alias.title

        SuggestSessionAlias.query('skull')['Session'][0]['value'].should.be.equal(expect_suggestion)
        SuggestSessionAlias.query('something wrong')['Session'].should.be.equal([])
