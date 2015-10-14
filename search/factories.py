import factory
from faker import Faker

from search.models.alias import Alias
from search.models.suggestion import SuggestionLog, FilterLog

fake = Faker()


class AliasFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alias

    alias = factory.Sequence(lambda n: fake.name())
    target = factory.Sequence(lambda n: fake.name())

class SuggestionLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SuggestionLog

    search_query= factory.Sequence(lambda n: fake.name())
    num_suggestions = factory.Sequence(lambda n: abs(fake.pyint()))
    session_id = factory.Sequence(lambda n: fake.name())

class FilterLogFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FilterLog

    tag_name = factory.Sequence(lambda n: fake.name())
    num_allegations = factory.Sequence(lambda n: abs(fake.pyint()))
    session_id = factory.Sequence(lambda n: fake.name())
