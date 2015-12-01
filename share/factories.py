import factory
from faker import Faker

from share.models import Session
from api.models import Setting


fake = Faker()


class SessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Session

    title = factory.Sequence(lambda n: fake.name())
    query = factory.Sequence(lambda n: {'title': fake.name()})
    ip = factory.Sequence(lambda n: '0.0.0.0')
    user_agent = factory.Sequence(lambda n: fake.name())
    searchable = False


class SettingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Setting

    default_site_title = factory.Sequence(lambda n: fake.name())
    story_types_order = factory.Sequence(lambda n: fake.name())
