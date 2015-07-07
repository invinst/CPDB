from common.tests.core import BaseLiveTestCase
from allegation.factories import AllegationFactory, AllegationCategoryFactory, OfficerFactory


class TestOfficerUnitUnknownTestCase(BaseLiveTestCase):
    def setUp(self):
        self.category = AllegationCategoryFactory()
        self.officer_with_unknown_unit = OfficerFactory(unit=None)
        self.officer_with_good_unit = OfficerFactory(unit='unit')
        for officer in [self.officer_with_good_unit, self.officer_with_unknown_unit]:
            AllegationFactory(officer=officer, cat=self.category)
        self.visit('/')

    def test_unit_in_officer_card_will_not_be_displayed_when_it_is_unknown(self):
        len(self.find_all('.officer')).should.be.equal(2)
        self.find("#officer_%s" % self.officer_with_unknown_unit.id).text.should_not.contain('Unit')
        self.find("#officer_%s" % self.officer_with_good_unit.id).text.should.contain('Unit')
