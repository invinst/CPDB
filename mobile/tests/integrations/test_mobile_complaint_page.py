from allegation.factories import (
    AllegationFactory, AllegationCategoryFactory, OfficerFactory,
    ComplainingWitnessFactory, InvestigatorFactory, OfficerAllegationFactory)
from common.tests.core import BaseLivePhoneTestCase
from document.factories import DocumentFactory


class MobileComplaintPageTest(BaseLivePhoneTestCase):
    def test_allegation_with_full_information(self):
        view_document_text = 'View'

        officer_gender = 'X'
        officer_gender_display = 'X'

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
            city='Chicago, IL', location='15')
        DocumentFactory(documentcloud_id=123, allegation=allegation)
        OfficerAllegationFactory(cat=category, officer=officer, allegation=allegation)

        ComplainingWitnessFactory(
            crid=allegation.crid, gender=complaint_witness_gender,
            allegation=allegation,
            race=complaint_witness_race, age=complaint_witness_age)

        self.visit_complaint_page(allegation.crid, category.id)
        self.until(lambda: self.find('.crid-number'))
        self.until(lambda: self.find('.allegation-category').text.should.be.equal(category.category))
        self.find('.allegation-name').text.should.be.equal(category.allegation_name)

        self.should_see_text(officer.display_name, '.against-section')
        self.should_see_text(officer_gender_display, '.against-section')
        self.should_see_text(complaint_witness_text, '.complaining-witness-list')
        self.should_see_text(investigator.name, '.investigator .name')
        self.should_see_text(investigator.current_rank, '.investigator .rank')
        self.should_see_text(allegation.beat.name, '.location-detail')

        self.should_see_text(view_document_text, '.document-card')

        location_detail = self.find('.location-detail').text
        location_detail.should.contain(addresss)
        location_detail.should.contain(allegation.city)
        location_detail.should.contain(allegation.location)

    def test_circle_color_of_involved_officers(self):
        crid = '1234'
        category = AllegationCategoryFactory()
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
            OfficerAllegationFactory(allegation=allegation, officer=officer, cat=category)

        self.visit_complaint_page(allegation.crid, category.id)
        self.until(lambda: self.should_not_see_text(allegation.crid))

        for circle_class, allegations_count in \
                allegations_count_color_map.items():
            selector = '.officer-card.officer-{id}  .{circle_class}'.format(
                id=officers[circle_class].id,
                circle_class=circle_class
            )

            self.find_all(selector).should.have.length_of(1)

    def test_allegation_with_bad_crid(self):
        bad_crid = 0
        self.visit_complaint_page(bad_crid, 0)
        self.until(lambda: self.find('.message-title'))
        self.should_see_text('Invalid page!')
        self.should_see_text('The CRID {crid} is not'.format(crid=bad_crid))

    def test_allegation_with_bad_category(self):
        cat = AllegationCategoryFactory()
        officer_allegation = OfficerAllegationFactory(cat=cat)

        self.visit_complaint_page(officer_allegation.allegation.crid, 0)
        self.until(lambda: self.find('.message-title'))

        self.should_see_text('Invalid page!')
        self.should_see_text('The complaint with this category is not recorded in our database. Please use search box '
                             'for new search session.')

    def test_toggle_complaint_page(self):
        category = AllegationCategoryFactory()
        allegation = AllegationFactory()
        OfficerAllegationFactory(cat=category, allegation=allegation)

        self.visit_complaint_page(allegation.crid, category.id)

        self.until(lambda: self.find('.number-of-allegations-section')).click()
        self.until(lambda: self.find('.toggle-page.content').text.should.contain(category.category))
        self.find_all('.officer-allegation-detail').should.have.length_of(0)

        self.find('.toggle-container').click()
        self.element_exist('.officer-allegation-detail.pad')
