import random

import factory
from faker import Faker

from wagtail_app.models import HomePage, GlossaryPage, GlossaryTableRows, GlossaryTableRow

fake = Faker()


class HomePageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = HomePage

    title = factory.LazyAttribute(lambda x: fake.word())
    slug = factory.LazyAttribute(lambda x: fake.word())


class GlossaryPageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GlossaryPage

    title = factory.LazyAttribute(lambda x: fake.word())
    slug = factory.LazyAttribute(lambda x: fake.word())


class GlossaryTableRowFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GlossaryTableRows

    term = factory.LazyAttribute(lambda x: fake.word())
    definition = factory.LazyAttribute(lambda x: fake.paragraph())
    category = factory.LazyAttribute(lambda x: random.choice([
        choice[0] for choice in GlossaryTableRow.CATEGORY_CHOICES]))
