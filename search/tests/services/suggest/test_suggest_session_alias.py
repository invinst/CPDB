from search.factories import SessionAliasFactory
from search.services.suggest.suggest_session_alias import SuggestSessionAlias
from search.tests.services.suggest.test_suggest_base import SuggestBaseTestCase


class SuggestSessionAliasTestCase(SuggestBaseTestCase):
    def test_suggest_session_alias_without_realtime_signal_processor(self):
        with self.settings(HAYSTACK_SIGNAL_PROCESSOR=''):
            session_alias = SessionAliasFactory(alias='skullcap')

            self.rebuild_index()

            expect_suggestion = session_alias.title

            SuggestSessionAlias.query('skull')['Session'][0]['label'].should.be.equal(expect_suggestion)
            SuggestSessionAlias.query('something wrong')['Session'].should.be.equal([])

    def test_suggest_session_alias_with_realtime_signal_processor(self):
        with self.settings(HAYSTACK_SIGNAL_PROCESSOR='haystack.signals.RealtimeSignalProcessor'):
            session_alias = SessionAliasFactory(alias='skullcap')

            expect_suggestion = session_alias.title

            SuggestSessionAlias.query('skull')['Session'][0]['label'].should.be.equal(expect_suggestion)
            SuggestSessionAlias.query('something wrong')['Session'].should.be.equal([])
