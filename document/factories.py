import factory
from faker import Faker

from document.models import RequestEmail
from share.factories import SessionFactory


fake = Faker()


class RequestEmailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RequestEmail
    crid = factory.Sequence(lambda n: str(n))
    email = factory.Sequence(lambda n: fake.email())
    session = factory.SubFactory(SessionFactory)
