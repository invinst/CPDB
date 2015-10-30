import random
import factory
import datetime

from django.contrib.gis.geos import MultiPolygon, Polygon

from faker import Faker

from allegation.models import Download
from common.models import AllegationCategory, Officer, Area, Allegation, Investigator, ComplainingWitness, RACES, \
    OUTCOMES, PoliceWitness, GENDER_DICT, RACES_DICT

fake = Faker()


class AreaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Area

    name = factory.Sequence(lambda n: fake.first_name())
    type = factory.Sequence(lambda n: 'school-grounds')
    polygon = factory.Sequence(lambda n: MultiPolygon(Polygon(((87.940101, 42.023135),
                                                               (87.523661, 42.023135),
                                                               (87.523661, 41.644286),
                                                               (87.940101, 41.644286),
                                                               (87.940101, 42.023135)))))


class PoliceWitnessFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PoliceWitness


class OfficerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Officer
        django_get_or_create = ('officer_first', 'officer_last')

    officer_first = factory.Sequence(lambda n: fake.first_name())
    officer_last = factory.Sequence(lambda n: fake.last_name())
    star = factory.Sequence(lambda n: n)
    gender = factory.Sequence(lambda n: random.choice(list(GENDER_DICT.keys())))
    race = factory.Sequence(lambda n: random.choice(list(RACES_DICT.keys())))


class InvestigatorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Investigator
        django_get_or_create = ('name',)

    name = factory.Sequence(lambda n: fake.name())
    complaint_count = factory.Sequence(lambda n: fake.random_int())


class AllegationCategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AllegationCategory
    cat_id = factory.Sequence(lambda n: "cat_%d" % n)
    allegation_name = factory.Sequence(lambda n: fake.name())
    category = factory.Sequence(lambda n: fake.name())


class ComplainingWitnessFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ComplainingWitness
    crid = factory.Sequence(lambda n: fake.random_int(min=1000))
    gender = factory.Sequence(lambda n: ['M', 'F'][n % 2])
    race = factory.Sequence(lambda n: RACES[n % len(RACES)][0])


class AllegationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Allegation

    crid = factory.Sequence(lambda n: fake.random_int(min=1000))
    cat = factory.SubFactory(AllegationCategoryFactory)
    final_outcome = factory.Sequence(lambda n: fake.random_element(x[0] for x in OUTCOMES))
    incident_date = factory.Sequence(lambda n: datetime.date(random.randint(2000, 2015), random.randint(1, 12), random.randint(1, 28)))
    incident_date_only = factory.LazyAttribute(lambda o: o.incident_date)
    investigator = factory.SubFactory(InvestigatorFactory)
    officer = factory.SubFactory(OfficerFactory)
    point = None
    document_requested = False

    @factory.post_generation
    def areas(self, create, extracted, **kwargs):

        if Area.objects.all().count() < 5 :
            for i in range(2):
                AreaFactory()
        extracted = Area.objects.all()

        if extracted:
            for area in extracted:
                self.areas.add(area)
                if not self.point and random.randint(0,10) > 5:
                    self.point = area.polygon.centroid
                    self.save()


class DownloadFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Download
    query = factory.Sequence(lambda n: fake.name())
    finished = factory.Sequence(lambda n: n % 2)
    url = factory.Sequence(lambda n: fake.url())
