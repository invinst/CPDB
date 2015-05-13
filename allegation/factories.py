import factory
from faker import Faker
from common.models import Allegation


fake = Faker()


class AllegationFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Allegation
