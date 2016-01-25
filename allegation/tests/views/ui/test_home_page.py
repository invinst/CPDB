import json

from wagtail.wagtailcore.models import Site

from allegation.factories import (
    AllegationCategoryFactory, OfficerAllegationFactory)
from common.tests.core import BaseLiveTestCase
from common.utils.haystack import rebuild_index
from share.models import Session
from home.factories import HomePageFactory
from home.models import HomePage


class HomePageTestCase(BaseLiveTestCase):
    def setUp(self):
        self.allegation_category = AllegationCategoryFactory()
        self.officer_allegation = OfficerAllegationFactory(
            cat=self.allegation_category, final_finding='NS')

    def tearDown(self):
        super(HomePageTestCase, self).tearDown()
        self.allegation_category.delete()
        if self.officer_allegation.officer:
            self.officer_allegation.officer.delete()
        else:
            self.officer_allegation.delete()

    def test_start_new_session_on_click_logo(self):
        Session.objects.all().count().should.equal(0)
        self.visit_home()
        self.link("Categories").click()
        self.find(".category-name-wrapper a").click()
        self.until_ajax_complete()
        Session.objects.all().count().should.equal(1)

        url = self.browser.current_url
        self.find("#logo_link img").click()
        self.until(lambda: self.browser.current_url != url)

        Session.objects.all().count().should.equal(2)
        session = Session.objects.all()[1]
        self.browser.current_url.should.contain(session.hash_id)

    def test_see_tabs(self):
        self.visit_home()
        links = self.find_all('.chart-row .nav a')
        link_texts = [x.text for x in links]
        link_texts.should.contain('Outcomes')
        link_texts.should.contain('Categories')
        link_texts.should.contain('Race & Gender')

    def test_close_disclaimer(self):
        self.visit_home()
        self.link('About the data').click()
        self.until(lambda: self.button('I UNDERSTAND').click())
        self.until(lambda: self.should_not_see_text('I UNDERSTAND'))

    def test_see_session_query_on_reload(self):
        self.visit_home()
        officer = self.officer_allegation.officer

        rebuild_index()

        self.until(
            lambda:
            self.fill_in('.ui-autocomplete-input', officer.officer_first))
        self.until_ajax_complete()
        self.until(lambda: self.find(".autocomplete-officer").is_displayed())
        self.find(".autocomplete-officer").click()

        self.should_see_text(officer.officer_first)
        self.should_see_text(officer.officer_last)

        self.browser.refresh()
        self.until(self.ajax_complete)
        self.until(lambda: self.should_see_text(officer.officer_first))
        self.should_see_text(officer.officer_last)

    def test_complaint_detail_without_investigator(self):
        self.officer_allegation.investigator = None
        self.officer_allegation.save()

        self.visit_home()
        self.link('Categories').click()
        self.find('.category-name').click()
        self.find('.complaint-row .cursor').click()
        officers_divs = self.find_all('.officers > div')

        len(officers_divs).should.equal(1)
        officers_divs[0].has_class('col-md-10')

    def click_sunburst_legend(self, text):
        self.element_by_tagname_and_text('td', text).click()
        self.sleep(0.75)
        self.until(
            lambda:
            self.element_by_classname_and_text('filter-name', text)
                .should.be.ok)

    def test_sunburst(self):
        us = 'Unsustained'
        ns = 'Not Sustained'

        self.visit_home()
        self.click_active_tab("Outcomes")
        with self.browser_no_wait():
            self.element_by_classname_and_text('filter-name', us)\
                .shouldnt.be.ok
            self.element_by_classname_and_text('filter-name', ns)\
                .shouldnt.be.ok

        self.click_sunburst_legend(us)

        with self.browser_no_wait():
            self.element_by_classname_and_text('filter-name', ns)\
                .shouldnt.be.ok

        sunburst_legend_root_text = self.find('#sunburst-legend .root').text
        url = self.browser.current_url
        with self.open_new_browser():
            self.visit(url)

            self.until_ajax_complete()
            self.sleep(0.75)  # sunburst zoom time

            with self.browser_no_wait():  # same state with above
                self.find('#sunburst-legend .root')\
                    .text.should.equal(sunburst_legend_root_text)

        self.click_sunburst_legend(ns)
        with self.browser_no_wait():
            self.element_by_classname_and_text(
                'filter-name', us).shouldnt.be.ok

        self.click_sunburst_legend(us)
        with self.browser_no_wait():
            self.element_by_classname_and_text(
                'filter-name', ns).shouldnt.be.ok

        self.find(".tag .remove").click()
        with self.browser_no_wait():
            self.element_by_tagname_and_text('td', ns).shouldnt.be.ok

    def test_sunburst_remove_tag(self):
        us = 'Unsustained'
        ns = 'Not Sustained'

        self.officer_allegation = OfficerAllegationFactory(
            cat=self.allegation_category, final_outcome='300')

        self.visit_home()
        self.click_active_tab("Outcomes")

        self.until(lambda: self.should_see_text('Officers (2)'))

        self.click_sunburst_legend(us)
        self.click_sunburst_legend(ns)
        self.until(lambda: self.element_by_classname_and_text('filter-name', ns))

        self.find(".tag .remove").click()
        self.until(lambda: self.element_by_classname_and_text('filter-name', us))
        self.until(lambda: self.should_see_text('Officers (1)'))

    def test_sticky_footer(self):
        officer = self.officer_allegation.officer
        OfficerAllegationFactory.create_batch(40, officer=officer)
        self.browser.set_window_size(width=1200, height=800)
        self.visit_home()
        self.is_displayed_in_viewport('.sticky-footer').should.be.false

        self.find('.checkmark').click()
        self.until_ajax_complete()

        self.browser.execute_script(
            "jQuery(window).scrollTop(jQuery('#complaint-list').offset().top + 100);")
        self.until(
            lambda:
            self.is_displayed_in_viewport('.sticky-footer').should.be.true)
        self.browser.execute_script(
            "jQuery(window).scrollTop(jQuery('#complaint-list').offset().top - 100);")

        self.until(
            lambda:
            self.is_displayed_in_viewport('.sticky-footer').should.be.false)

    def test_replace_old_filter_in_same_category(self):
        officer_allegation = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_not_see_text(officer_allegation.officer.display_name)

    def test_pin_tag(self):
        officer_allegation = OfficerAllegationFactory()
        another = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.until(
            lambda:
            self.find('.tag').get_attribute('class').should.contain('pinned'))

        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)

        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)
        self.should_not_see_text(self.officer_allegation.officer.display_name)

    def test_unpin_tag(self):
        officer_allegation = OfficerAllegationFactory()
        another = OfficerAllegationFactory()

        rebuild_index()

        self.visit_home()
        self.search_officer(officer_allegation.officer)
        self.should_see_text(officer_allegation.officer.display_name)

        self.find('.tag > .pin').click()
        self.search_officer(self.officer_allegation.officer)
        self.should_see_text(self.officer_allegation.officer.display_name)
        self.should_see_text(officer_allegation.officer.display_name)

        element = self.find('.pinned')
        element.find('.pin').click()
        self.until(
            lambda: element.get_attribute('class').shouldnt.contain('pinned'))

        self.search_officer(another.officer)
        self.should_see_text(another.officer.display_name)
        self.should_not_see_text(officer_allegation.officer.display_name)
        self.should_not_see_text(self.officer_allegation.officer.display_name)

    def autocomplete_available(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        items = [x.text for x in items]
        return any(text in x for x in items)

    def autocomplete_select(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        for item in items:
            if text in item.text:
                item.click()

    def search_officer(self, officer):
        self.fill_in("#autocomplete", officer.officer_first)
        self.until_ajax_complete()
        self.find(".ui-autocomplete").is_displayed()
        self.until(lambda: self.autocomplete_available(officer.display_name))
        self.autocomplete_select(officer.display_name)
        self.until_ajax_complete()

    def test_default_site_title_from_settings(self):
        setting = self.get_admin_settings()
        setting.default_site_title = 'New title'
        setting.save()

        self.visit_home(fresh=True)
        self.browser.title.should.equal(setting.default_site_title)

    def test_wagtail_tab(self):
        body_content = 'body content'
        body = json.dumps([
            {
                'value': [
                    {
                        'value': '<p>{content}</p>'.format(
                            content=body_content),
                        'type': 'half_paragraph'
                    }
                ],
                'type': 'row_section'
            }
        ])
        HomePage.get_tree().all().delete()
        root = HomePage.add_root(instance=HomePageFactory.build(
            title='Root', slug='root'))
        homepage = root.add_child(
            instance=HomePageFactory.build(
                title='child', body=body, slug='child'))
        Site.objects.create(
            is_default_site=True, root_page=root, hostname='localhost')

        self.visit_home(fresh=True)
        self.should_see_text(homepage.title)
        self.link(homepage.title).click()
        self.should_see_text(body_content)
