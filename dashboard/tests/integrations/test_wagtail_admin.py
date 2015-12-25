from wagtail.wagtailcore.models import Site

from common.tests.core import BaseAdminTestCase
from home.models import HomePage
from home.factories import HomePageFactory


class WagtailAdminTestCase(BaseAdminTestCase):
    def setUp(self):
        super(WagtailAdminTestCase, self).setUp()
        HomePage.get_tree().all().delete()
        Site.objects.all().delete()

    def test_can_create_content_page(self):
        root = HomePage.add_root(instance=HomePageFactory.build(title='Root'))
        homepage = root.add_child(instance=HomePageFactory.build(title='child'))
        default_site = Site.objects.create(is_default_site=True, root_page=root, hostname='localhost')

        page_title = 'title'
        body_content = 'body content'

        self.visit('/wagtail-admin/pages/{page_id}/'.format(page_id=homepage.id))
        self.find('.icon-plus').click()
        self.until(lambda: self.find('#id_title'))
        self.fill_in('#id_title', page_title)

        self.find('button.action-add-block-row_section').click()
        self.until(lambda: self.find('button.action-add-block-half_paragraph').click())
        self.until(lambda: self.fill_in('.richtext.inEditMode', body_content))

        self.find('.icon-arrow-up').click()
        self.until(lambda: self.find('button[name=action-publish]').click())
        self.until(lambda: self.should_see_text('Page \'{title}\' created and published.'.format(title=page_title)))

        content_page = HomePage.objects.get(title=page_title)
        str(content_page.body).should.contain(body_content)
