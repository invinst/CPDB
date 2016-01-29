import copy

from common.tests.core import SimpleTestCase
from allegation.factories import OfficerAllegationFactory
from allegation.serializers import SunburstSerializer
from common.models import OfficerAllegation


class SunburstSerializerTestCase(SimpleTestCase):
    def test_serialize_data(self):
        for ff in ['DS', 'EX', 'NA', 'NC', 'NS', 'UN', 'ZZ']:
            OfficerAllegationFactory(final_finding=ff)

        for fo in ['100', '002', '012', '120', '300', '400', None, '000', '500', '600', '700', '800', '900']:
            OfficerAllegationFactory(final_finding='SU', final_outcome=fo)

        serializer = SunburstSerializer(OfficerAllegation.objects.all())
        len(serializer.data).should.equal(2)
        self.sum_count(serializer.data, 'Unsustained').should.equal(7)
        self.sum_count(serializer.data, 'Sustained').should.equal(13)
        self.sum_count(serializer.data, 'Not Disciplined').should.equal(7)
        self.sum_count(serializer.data, 'Disciplined').should.equal(6)

    def sum_count(self, data, category_name):
        category = self.get_category_obj(data, category_name)

        if 'size' in category:
            return category['size']
        else:
            count = 0
            subcats = copy.copy(category['children'])
            while(subcats):
                subcat = subcats.pop()
                if 'size' in subcat:
                    count += subcat['size']
                else:
                    subcats.extend(subcat['children'])
            return count

    def get_category_obj(self, data, category_name):
        cats = copy.copy(data)
        while(cats):
            cat = cats.pop()
            if cat['name'] == category_name:
                return cat
            if 'children' in cat:
                cats.extend(cat['children'])
        return None
