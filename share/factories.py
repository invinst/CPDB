import factory
from faker import Faker

from share.models import Session


fake = Faker()


class SessionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Session

    title = lambda: fake.name()
    query = factory.Sequence(lambda n: {'title': fake.name()})
