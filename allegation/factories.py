from django.utils import timezone
import factory
from faker import Faker
from common.models import Allegation, AllegationCategory, Officer


fake = Faker()


class OfficerFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Officer
        django_get_or_create = ('officer_first', 'officer_last')

    officer_first = factory.Sequence(lambda n: fake.first_name())
    officer_last = factory.Sequence(lambda n: fake.last_name())
    star = factory.Sequence(lambda n: n)


class AllegationCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AllegationCategory
        django_get_or_create = ('cat_id',)

    cat_id = factory.Sequence(lambda n: fake.random_element(['12A', '34B']))
    allegation_name = factory.Sequence(lambda n: fake.name())


class AllegationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Allegation


    crid = factory.Sequence(lambda n: n % 10)
    cat = factory.SubFactory(AllegationCategoryFactory)
    officer = factory.SubFactory(OfficerFactory)
    final_outcome = factory.Sequence(lambda n: fake.random_element(['600', '601']))
    incident_date = factory.Sequence(lambda n: timezone.now())
