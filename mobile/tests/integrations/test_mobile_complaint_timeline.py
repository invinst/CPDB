from datetime import datetime

from django.utils import timezone

from allegation.factories import AllegationFactory, OfficerAllegationFactory
from common.tests.core import BaseLivePhoneTestCase


class MobileComplaintTimelineTest(BaseLivePhoneTestCase):
    def assert_timeline_have_three_nodes(self):
        nodes = self.find_all('.drawing line')
        len(nodes).should.equal(2)

    def assert_timeline_have_two_nodes(self):
        nodes = self.find_all('.drawing line')
        len(nodes).should.equal(1)

    def assert_no_timeline(self):
        len(self.find_all('.investigation-timeline svg')).should.equal(0)

    def assert_timeline_should_contains_text(self, text):
        self.find('.investigation-timeline svg').text.should.contain(text)

    def assert_line_is_dash_line(self, line):
        line.value_of_css_property('stroke-dasharray').should.be.equal('2, 2')

    def assert_line_is_not_dash_line(self, line):
        line.value_of_css_property('stroke-dasharray').should.be.equal('none')

    def test_all_good_data(self):
        incident_date = datetime(2000, 12, 6)
        start_date = datetime(2001, 6, 1)
        end_date = datetime(2002, 7, 22)
        final_finding = 'EX'

        start_date_text = 'Jun 01, 2001'
        end_date_text = 'Jul 22, 2002'
        incident_date_text = 'Dec 06, 2000'
        final_finding_text = 'Exonerated'

        allegation = AllegationFactory(incident_date=incident_date)
        OfficerAllegationFactory(
            allegation=allegation, final_finding=final_finding,
            start_date=start_date, end_date=end_date)

        self.visit_complaint_page(allegation)
        self.assert_timeline_have_three_nodes()
        self.assert_timeline_should_contains_text(incident_date_text)
        self.assert_timeline_should_contains_text(start_date_text)
        self.assert_timeline_should_contains_text(end_date_text)
        self.assert_timeline_should_contains_text(final_finding_text)
        self.assert_timeline_should_contains_text('Investigation Closed')

        lines = self.find_all('.investigation-timeline line')

        self.assert_line_is_not_dash_line(lines[0])
        self.assert_line_is_not_dash_line(lines[1])

    def test_same_incident_and_start_date(self):
        allegation = AllegationFactory(incident_date=timezone.now())
        OfficerAllegationFactory(
            allegation=allegation, start_date=datetime.now())
        self.visit_complaint_page(allegation)
        self.assert_timeline_have_two_nodes()

    def test_no_time_line(self):
        allegation = AllegationFactory(incident_date=None)
        OfficerAllegationFactory(
            allegation=allegation, start_date=None, end_date=None)
        self.visit_complaint_page(allegation)
        self.assert_no_timeline()

    def test_no_incident_date(self):
        start_date = datetime(2001, 6, 1)
        end_date = datetime(2002, 7, 22)
        allegation = AllegationFactory(incident_date=None)
        OfficerAllegationFactory(
            allegation=allegation, start_date=start_date, end_date=end_date)

        self.visit_complaint_page(allegation)
        first_line = self.find('.investigation-timeline line')
        self.assert_line_is_dash_line(first_line)
        self.find_all('.event-date')[0].text.should.contain('Unknown date')

    def test_open_investigation(self):
        start_date = datetime(2001, 6, 1)
        incident_date = datetime(2002, 7, 22)
        allegation = AllegationFactory(incident_date=incident_date)
        OfficerAllegationFactory(
            allegation=allegation, start_date=start_date, end_date=None,
            final_outcome_class='open-investigation')

        self.visit_complaint_page(allegation)

        second_line = self.find_all('.investigation-timeline line')[1]
        self.assert_line_is_dash_line(second_line)
        self.assert_timeline_should_contains_text('Open Investigation')
