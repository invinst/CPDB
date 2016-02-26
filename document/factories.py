import factory
from faker import Faker

from allegation.factories import AllegationFactory
from document.models import RequestEmail
from document.models.document import Document
from share.factories import SessionFactory


fake = Faker()


class RequestEmailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RequestEmail
    crid = factory.Sequence(lambda n: str(n))
    email = factory.Sequence(lambda n: fake.email())
    session = factory.SubFactory(SessionFactory)
    email = factory.Sequence(lambda n: 'email{n}@example.com'.format(n=n))


class DocumentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Document
    documentcloud_id = 0
    title = factory.Sequence(lambda n: fake.name())
    type = 'CR'

    allegation = factory.SubFactory(AllegationFactory)
