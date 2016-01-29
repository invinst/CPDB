from allegation.factories import AllegationCategoryFactory
from common.tests.core import BaseLiveTestCase
from share.factories import SessionFactory


class ShareSessionTestCase(BaseLiveTestCase):
    def test_browse_session_admin(self):
        self.login_user()
        self.visit("/admin/models/")

        link = self.link("Sessions")
        link.should.be.ok

        session = SessionFactory()
        link.click()
        self.should_see_texts([
            session.hash_id,
            "Fresh",
            session.query['title']
        ])

        shared_session = SessionFactory(share_from=session)
        self.browser.refresh()

        self.should_see_texts([
            shared_session.hash_id,
            "Shared",
            shared_session.query['title']
        ])

        category = AllegationCategoryFactory()
        SessionFactory(query={
            'filters': {
                'cat__category': {
                    'value': [category.category]
                }
            }
        })
        self.browser.refresh()
        self.should_see_texts([
            'Chicago Police Database',
            category.category,
        ])

        self.find("#searchbar").send_keys("{query}\n".format(query=session.query['title']))
        self.should_see_text(session.query['title'])
        self.should_not_see_text(shared_session.query['title'])

        self.fill_in("#searchbar", "{query}\n".format(query=session.hash_id))
        self.should_see_text(session.query['title'])
        self.should_not_see_text(shared_session.query['title'])
