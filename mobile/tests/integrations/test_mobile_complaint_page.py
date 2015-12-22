from allegation.factories import AllegationFactory, AllegationCategoryFactory, OfficerFactory, \
    ComplainingWitnessFactory, InvestigatorFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileComplaintPageTestMixin(BaseLivePhoneTestCase):
    def go_to_allegation_detail_page(self, crid=''):
        self.visit('/mobile/complaint/{crid}'.format(crid=crid))


class MobileComplaintPageTest(MobileComplaintPageTestMixin):
    def test_allegation_with_full_information(self):
        final_finding_code = 'UN'
        final_finding_text = 'Unfounded'
        complaint_witness_gender = 'F'
        complaint_witness_race = 'Black'
        complaint_witness_age = 40
        complaint_witness_text = 'Female, Black, Age 40'
        address1 = 4748
        address2 = 'N Kimball Ave'
        addresss = '{add1} {add2}'.format(add1=address1, add2=address2)
        category = AllegationCategoryFactory()
        officer = OfficerFactory()
        current_rank = 'SERGEANT OF POLICE'
        investigator = InvestigatorFactory(current_rank=current_rank)

        allegation = AllegationFactory(final_finding=final_finding_code, cat=category, officer=officer,
                                       investigator=investigator, add1=address1, add2=address2,
                                       city='Chicago, IL', location='15')

        ComplainingWitnessFactory(crid=allegation.crid, gender=complaint_witness_gender, race=complaint_witness_race,
                                  age=complaint_witness_age)

        self.go_to_allegation_detail_page(crid=allegation.crid)
        self.until(lambda: self.find('.crid-number'))

        self.find('.final-finding').text.should.be.equal(final_finding_text)
        self.find('.complaint-category').text.should.be.equal(category.category)
        self.find('.complaint-sub-category').text.should.be.equal(category.allegation_name)
        self.find('.officer-involved').text.should.contain(officer.display_name)
        self.find('.officer-involved').text.should.contain(officer.gender)
        self.find('.complaining-witness-list').text.should.contain(complaint_witness_text)
        self.find('.investigator .name').text.should.contain(investigator.name)
        self.find('.investigator .rank').text.should.contain(investigator.current_rank)
        self.find('.location-detail').text.should.contain(allegation.beat.name)

        self.should_see_text(addresss)
        self.should_see_text(allegation.city)
        self.should_see_text(allegation.location)

    def test_allegation_with_bad_crid(self):
        bad_crid = 0
        self.visit('/mobile/complaint/{crid}'.format(crid=bad_crid))
        self.until(lambda: self.find('.message-title'))
        self.should_see_text('Invalid page!')
        self.should_see_text('The CRID {crid} is not'.format(crid=bad_crid))

    def test_allegation_with_no_category(self):
        allegation = AllegationFactory(cat=None)
        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-number'))

        self.find('.complaint-category').text.should.be.equal('Unknown')
        self.find('.complaint-sub-category').text.should.be.equal('Unknown')

    def test_allegation_with_no_complaint_witness(self):
        allegation = AllegationFactory()

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Complaining Witness')

    def test_allegation_with_no_officers_involved(self):
        allegation = AllegationFactory(officer=None)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Officers involved')

    def test_allegation_with_no_investigator(self):
        allegation = AllegationFactory(officer=None, investigator=None)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Investigator')

    def test_investigator_without_rank(self):
        investigator = InvestigatorFactory(current_rank=None)
        allegation = AllegationFactory(officer=None, investigator=investigator)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Rank unknown')

    def test_officer_with_unknown_race(self):
        officer = OfficerFactory(race='Unknown')
        allegation = AllegationFactory(officer=officer)
        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Race unknown')

    def test_officer_without_gender(self):
        allegation = AllegationFactory()
        ComplainingWitnessFactory(gender=None, age=None, race=None, crid=allegation.crid)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Gender unknown')
        self.should_see_text('Race unknown')
        self.should_see_text('Age unknown')
