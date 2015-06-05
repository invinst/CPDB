from django.utils import timezone
import factory
from faker import Faker

from common.models import Allegation, AllegationCategory, Officer, Area

fake = Faker()


class AreaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Area

    name = factory.Sequence(lambda n: fake.first_name())
    type = factory.Sequence(lambda n: fake.first_name())


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

    cat_id = factory.Sequence(lambda n: ['12A', '34B'][n % 2])
    allegation_name = factory.Sequence(lambda n: fake.name())
    category = factory.Sequence(lambda n: fake.name())


class AllegationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Allegation

    crid = factory.Sequence(lambda n: fake.random_int(min=1000))
    cat = factory.SubFactory(AllegationCategoryFactory)
    officer = factory.SubFactory(OfficerFactory)
    final_outcome = factory.Sequence(lambda n: fake.random_element(['600', '601']))
    incident_date = factory.Sequence(lambda n: timezone.now())
    incident_date_only = factory.LazyAttribute(lambda o: o.incident_date.date())
    investigator = factory.Sequence(lambda n: fake.name())

    @factory.post_generation
    def areas(self, create, extracted, **kwargs):

        if Area.objects.all().count() == 0:
            for i in range(2):
                area = AreaFactory()
            extracted = Area.objects.all()

        if extracted:
            # A list of groups were passed in, use them
            for area in extracted:
                self.areas.add(area)
