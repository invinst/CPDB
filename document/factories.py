import factory
from factory.helpers import post_generation
from faker import Faker

from allegation.factories import AllegationFactory
from document.models import RequestEmail, Document
from share.factories import SessionFactory


fake = Faker()


class DocumentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Document
    documentcloud_id = 0
    title = factory.Sequence(lambda n: fake.name())
    type = 'CR'

    allegation = factory.SubFactory(AllegationFactory)

    @post_generation
    def remove_unnecessary_document(self, created, extracted, **kwargs):
        if created:
            self.allegation.documents.filter(type=self.type).exclude(id=self.id).delete()


class RequestEmailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RequestEmail
    crid = factory.Sequence(lambda n: str(n))
    email = factory.Sequence(lambda n: fake.email())
    session = factory.SubFactory(SessionFactory)
    document = factory.SubFactory(DocumentFactory)
