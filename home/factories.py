import factory

from faker import Faker

from home.models import HomePage

fake = Faker()


class HomePageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = HomePage

    title = fake.word()
    slug = fake.word()
