import factory
from faker import Faker

from search.models.alias import Alias


faker = Faker()


class AliasFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alias

    alias = factory.Sequence(lambda n: faker.name())
    target = factory.Sequence(lambda n: faker.name())
