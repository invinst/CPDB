import factory
from faker import Faker

from search.models.alias import Alias
from search.models.suggestion import SuggestionLog

fake = Faker()


class AliasFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alias

    alias = factory.Sequence(lambda n: fake.name())
    target = factory.Sequence(lambda n: fake.name())

class SuggestionLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SuggestionLog

    query= factory.Sequence(lambda n: fake.name())
    num_suggestions = factory.Sequence(lambda n: abs(fake.pyint()))
    session_id = factory.Sequence(lambda n: fake.name())
    ip = factory.Sequence(lambda n: '0.0.0.0')
