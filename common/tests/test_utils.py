from common.tests.core import SimpleTestCase
from common.tests.utils import sum_count, get_category_obj


class UtilsTestCase(SimpleTestCase):

    def test_get_category_obj(self):
        d1 = {'name': 'obj d1'}
        get_category_obj([d1], 'obj d1').should.be.equal(d1)

        d2 = {'name': 'obj d2'}
        d3 = {'name': 'obj d3', 'children': [d2]}
        get_category_obj([d3], 'obj d2').should.be.equal(d2)
        get_category_obj([d3], 'obj d3').should.be.equal(d3)
        get_category_obj([d3], 'obj d4').should.be.equal(None)

    def test_sum_count(self):
        sum_count({'size': 1}).should.be.equal(1)
        sum_count({'children': [{'size': 2}, {'size': 3}, {'size': 4}, {'children': [{'size': 1}]}]})\
            .should.be.equal(10)
