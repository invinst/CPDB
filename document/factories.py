import factory
from document.models import RequestEmail
from share.factories import SessionFactory


class RequestEmailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RequestEmail
    session = factory.SubFactory(SessionFactory)
    email = factory.Sequence(lambda n: 'email{n}@example.com'.format(n=n))
