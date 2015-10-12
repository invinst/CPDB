import json

from officer.factories import StoryFactory
from common.tests.core import SimpleTestCase


class StoryTypeTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()

    def test_suggest_existing_types(self):
        story = StoryFactory(story_type='Old')

        response = self.client.get('/api/dashboard/story_types/', {'query': story.story_type[0]})
        response.status_code.should.equal(200)

        content = json.loads(response.content.decode())
        data = content['data']
        data.should.contain(story.story_type)

    def test_no_matched_type(self):
        response = self.client.get('/api/dashboard/story_types/', {'query': 'N'})
        response.status_code.should.equal(200)

        content = json.loads(response.content.decode())
        data = content['data']
        data.should.be.empty

    def test_distinct_query(self):
        story = StoryFactory(story_type='Old')
        StoryFactory(story_type='Old')

        response = self.client.get('/api/dashboard/story_types/', {'query': story.story_type[0]})
        content = json.loads(response.content.decode())
        data = content['data']
        len(data).should.equal(1)
        data.should.contain(story.story_type)

    def test_limit_results(self):
        limit = 10
        types = ['Type %s' % i for i in range(11)]
        for story_type in types:
            StoryFactory(story_type=story_type)

        response = self.client.get('/api/dashboard/story_types/', {'query': 'Type'})
        content = json.loads(response.content.decode())
        data = content['data']
        len(data).should.equal(limit)
