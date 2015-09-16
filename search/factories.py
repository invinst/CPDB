import factory
from faker import Faker

from search.models.alias import Alias
from search.models.suggestion import SuggestionLog

faker = Faker()


class AliasFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alias

    alias = factory.Sequence(lambda n: faker.name())
    target = factory.Sequence(lambda n: faker.name())

class SuggestionLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SuggestionLog

    query= factory.Sequence(lambda n: faker.name())
    num_suggestion = factory.Sequence(lambda n: faker.pyint())
    session_id = factory.Sequence(lambda n: faker.name())
    target = factory.Sequence(lambda n: faker.name())
    ip = factory.Sequence(lambda n: faker.ip())
