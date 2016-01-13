from allegation.factories import (
    AllegationFactory, AllegationCategoryFactory, OfficerFactory,
    ComplainingWitnessFactory, InvestigatorFactory, OfficerAllegationFactory)
from common.tests.core import BaseLivePhoneTestCase


class MobileComplaintPageTestMixin(BaseLivePhoneTestCase):
    def go_to_allegation_detail_page(self, crid=''):
        self.visit('/mobile/complaint/{crid}'.format(crid=crid))

class MobileComplaintPageTest(MobileComplaintPageTestMixin):
    def test_allegation_with_full_information(self):
        document_id = 123
        document_normalized_title = 'abcd'
        view_document_text = 'View documents'
        view_document_link_format = 'http://documentcloud.org/documents/{id}-{title}.html'
        view_document_link = view_document_link_format.format(
            id=document_id, title=document_normalized_title)
        officer_gender = 'X'
        officer_gender_display = 'Trans'

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
        officer = OfficerFactory(gender=officer_gender)
        current_rank = 'SERGEANT OF POLICE'
        investigator = InvestigatorFactory(current_rank=current_rank)

        allegation = AllegationFactory(
            investigator=investigator, add1=address1, add2=address2,
            city='Chicago, IL', location='15', document_id=document_id,
            document_normalized_title=document_normalized_title)
        OfficerAllegationFactory(
            cat=category, officer=officer, allegation=allegation,
            final_finding=final_finding_code)

        ComplainingWitnessFactory(
            crid=allegation.crid, gender=complaint_witness_gender,
            allegation=allegation,
            race=complaint_witness_race, age=complaint_witness_age)

        self.go_to_allegation_detail_page(crid=allegation.crid)
        self.until(lambda: self.find('.crid-number'))

        self.find('.final-finding').text.should.be.equal(final_finding_text)
        self.find('.complaint-category').text.should.be.equal(
            category.category)
        self.find('.complaint-sub-category').text.should.be.equal(
            category.allegation_name)
        self.find('.officer-involved').text.should.contain(
            officer.display_name)
        self.find('.officer-involved').text.should.contain(officer_gender_display)
        self.find('.complaining-witness-list').text.should.contain(
            complaint_witness_text)
        self.find('.investigator .name').text.should.contain(investigator.name)
        self.find('.investigator .rank').text.should.contain(
            investigator.current_rank)
        self.find('.location-detail').text.should.contain(allegation.beat.name)
        self.find('.document-link').get_attribute('href')\
            .should.equal(view_document_link)

        self.should_see_text(view_document_text)
        self.should_see_text(addresss)
        self.should_see_text(allegation.city)
        self.should_see_text(allegation.location)

    def test_circle_color_of_involved_officers(self):
        crid = '1234'
        allegation = AllegationFactory(crid=crid)
        allegations_count_color_map = {
            'circle-0': 21,
            'circle-1': 11,
            'circle-2': 4,
            'circle-3': 2,
            'circle-4': 1
        }
        officers = {}

        for circle_class, allegations_count in \
                allegations_count_color_map.items():
            officer = OfficerFactory(allegations_count=allegations_count)
            officers[circle_class] = officer
            OfficerAllegationFactory(allegation=allegation, officer=officer)

        self.go_to_allegation_detail_page(crid=crid)

        for circle_class, allegations_count in \
                allegations_count_color_map.items():
            selector = '.officer-card.officer-{id}  .{circle_class}'.format(
                id=officers[circle_class].id,
                circle_class=circle_class
            )
            len(self.find_all(selector)).should.be.equal(1)

    def test_allegation_with_bad_crid(self):
        bad_crid = 0
        self.visit('/mobile/complaint/{crid}'.format(crid=bad_crid))
        self.until(lambda: self.find('.message-title'))
        self.should_see_text('Invalid page!')
        self.should_see_text('The CRID {crid} is not'.format(crid=bad_crid))

    def test_allegation_with_no_category(self):
        officer_allegation = OfficerAllegationFactory(cat=None)
        self.visit('/mobile/complaint/{crid}'.format(
            crid=officer_allegation.allegation.crid))
        self.until(lambda: self.find('.crid-number'))

        self.find('.complaint-category').text.should.be.equal('Unknown')
        self.find('.complaint-sub-category').text.should.be.equal('Unknown')

    def test_allegation_with_no_complaint_witness(self):
        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Complaining Witness')

    def test_allegation_with_no_officers_involved(self):
        officer_allegation = OfficerAllegationFactory(officer=None)

        self.visit('/mobile/complaint/{crid}'.format(
            crid=officer_allegation.allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Officers involved')

    def test_allegation_without_document(self):
        officer_allegation = OfficerAllegationFactory(officer=None)

        self.visit('/mobile/complaint/{crid}'.format(
            crid=officer_allegation.allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('View documents')

    def test_allegation_with_no_investigator(self):
        allegation = AllegationFactory(investigator=None)
        OfficerAllegationFactory(
            officer=None, allegation=allegation)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_not_see_text('Investigator')

    def test_investigator_without_rank(self):
        investigator = InvestigatorFactory(current_rank=None)
        allegation = AllegationFactory(investigator=investigator)
        OfficerAllegationFactory(
            officer=None, allegation=allegation)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Rank unknown')

    def test_officer_with_unknown_race(self):
        officer = OfficerFactory(race='Unknown')
        officer_allegation = OfficerAllegationFactory(officer=officer)
        self.visit('/mobile/complaint/{crid}'.format(
            crid=officer_allegation.allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Race unknown')

    def test_officer_without_gender(self):
        allegation = AllegationFactory()
        OfficerAllegationFactory(allegation=allegation)
        ComplainingWitnessFactory(
            gender=None, age=None, race=None, crid=allegation.crid,
            allegation=allegation)

        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))
        self.until(lambda: self.find('.crid-title'))

        self.should_see_text('Gender unknown')
        self.should_see_text('Race unknown')
        self.should_see_text('Age unknown')
