from django.db.models import Case, Value, When, CharField

from allegation.models.utils import get_num_range_case
from common.tests.core import SimpleTestCase, repr_equal_either


class ModelUtilsTestCase(SimpleTestCase):
    def test_get_num_range_case(self):
        result = get_num_range_case('a', [1, 5])

        repr_equal_either(
            result,
            (
                "<Case: CASE WHEN <Q: (AND: ('a__gte', 1), ('a__lte', 5))> THEN Value(1-5), "
                "WHEN <Q: (AND: ('a__gte', 6))> THEN Value(6+), ELSE Value(Unknown)>"),
            (
                "<Case: CASE WHEN <Q: (AND: ('a__lte', 5), ('a__gte', 1))> THEN Value(1-5), "
                "WHEN <Q: (AND: ('a__gte', 6))> THEN Value(6+), ELSE Value(Unknown)>")
        )

    def test_get_num_range_case_single_value(self):
        num_range = [1]
        expect_result = Case(
            When(a__gte=1, then=Value('1+')),
            default=Value('Unknown'),
            output_field=CharField()
            )
        actual_result = get_num_range_case('a', num_range)

        repr(expect_result).should.equal(repr(actual_result))

    def test_get_num_range_case_empty_array(self):
        num_range = []
        expect_result = Case(
            default=Value('Unknown'),
            output_field=CharField()
            )
        actual_result = get_num_range_case('a', num_range)

        repr(expect_result).should.equal(repr(actual_result))

    def test_get_num_range_case_begin_with_zero(self):
        result = get_num_range_case('a', [0, 3, 5])

        repr_equal_either(
            result,
            (
                "<Case: CASE WHEN <Q: (AND: ('a__lte', 3))> THEN Value(<3), "
                "WHEN <Q: (AND: ('a__gte', 4), ('a__lte', 5))> "
                "THEN Value(4-5), WHEN <Q: (AND: ('a__gte', 6))> THEN Value(6+), ELSE Value(Unknown)>"),
            (
                "<Case: CASE WHEN <Q: (AND: ('a__lte', 3))> THEN Value(<3), "
                "WHEN <Q: (AND: ('a__lte', 5), ('a__gte', 4))> "
                "THEN Value(4-5), WHEN <Q: (AND: ('a__gte', 6))> THEN Value(6+), ELSE Value(Unknown)>")
        )
