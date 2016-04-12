from allegation.factories import OfficerAllegationFactory
from allegation.serializers import SunburstSerializer
from common.models import OfficerAllegation
from common.tests.utils import sum_count, get_category_obj
from common.tests.core import SimpleTestCase


class SunburstSerializerTestCase(SimpleTestCase):
    def test_serialize_data(self):
        for ff in ['DS', 'EX', 'NA', 'NC', 'NS', 'UN', 'ZZ']:
            OfficerAllegationFactory(final_finding=ff)

        for fo in ['100', '002', '012', '120', '300', '400', None, '000', '500', '600', '700', '800', '900']:
            OfficerAllegationFactory(final_finding='SU', final_outcome=fo)

        serializer = SunburstSerializer(OfficerAllegation.objects.all())
        children = serializer.data['children']
        len(children).should.equal(2)
        sum_count(get_category_obj(children, 'Unsustained')).should.equal(7)
        sum_count(get_category_obj(children, 'Sustained')).should.equal(13)
        sum_count(get_category_obj(children, 'No Discipline')).should.equal(7)
        sum_count(get_category_obj(children, 'Disciplined')).should.equal(6)
