from common.tests.core import BaseLiveTestCase


class AutocompleteTestHelperMixin(BaseLiveTestCase):
    def search_officer(self, officer):
        self.fill_in("#autocomplete", officer.officer_first)
        self.until_ajax_complete()
        self.until(lambda: self.find(".ui-autocomplete").is_displayed())
        self.until(lambda: self.autocomplete_available(officer.officer_last))
        self.autocomplete_select(officer.display_name)
        self.until_ajax_complete()

    def autocomplete_available(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        items = [x.text for x in items]
        return any(text in x for x in items)

    def autocomplete_select(self, text):
        items = self.find_all(".ui-autocomplete .ui-menu-item")
        for item in items:
            if text in item.text:
                item.click()
