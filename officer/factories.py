import factory
from faker import Faker

from allegation.factories import OfficerFactory
from officer.models import Story


fake = Faker()


class StoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Story

    officer = factory.SubFactory(OfficerFactory)
    title = factory.Sequence(lambda n: fake.text(max_nb_chars=100))
    slug = "slug"
    short_description = factory.Sequence(lambda n: fake.text(max_nb_chars=200))
    content = factory.Sequence(lambda n: "\n".join(fake.paragraphs(nb=3)))
    story_type = factory.Sequence(lambda n: fake.word())
