import json

from common.tests.core import SimpleTestCase
from officer.factories import StoryFactory


class StoryViewTestCase(SimpleTestCase):
    def test_fetch_stories(self):
        story = StoryFactory()
        response = self.client.get("/officer/stories/", {
            'officer': story.officer.id,
        })

        response.status_code.should.equal(200)
        data = json.loads(response.content.decode())

        data['success'].should.be.true
        isinstance(data['stories'], list).should.be.true

        data['stories'][0]['officer']['pk'].should.equal(story.officer.id)
