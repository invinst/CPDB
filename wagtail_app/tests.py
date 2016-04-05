import json

from common.tests.core import SimpleTestCase
from wagtail_app.factories import HomePageFactory
from wagtail_app.models import HomePage


class HomePageModelTestCase(SimpleTestCase):
    def test_extended_body_prop(self):
        body = [
            {
                'value': [
                    {
                        'value': '<p>content</p>',
                        'type': 'half_paragraph'
                    }
                ],
                'type': 'row_section'
            }
        ]
        HomePage.get_tree().all().delete()
        root = HomePage.add_root(instance=HomePageFactory.build(
            title='Root', slug='root'))
        homepage = root.add_child(
            instance=HomePageFactory.build(
                title='child', body=json.dumps(body), slug='child'))

        homepage.extended_body().should.equal(body)
