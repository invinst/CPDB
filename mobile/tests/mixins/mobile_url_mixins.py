class MobileUrlMixins(object):
    def visit_mobile_home(self):
        self.visit('/')

    def visit_complaint_page(self, crid):
        self.visit('/complaint/{crid}'.format(crid=crid))

    def visit_officer_page(self, officer_id):
        self.visit('/officer/any-slug/{officer_id}'.format(officer_id=officer_id))

    def visit_officer_page_tab(self, officer_id, tab='summary'):
        self.visit('/officer/any-slug/{officer_id}#{tab}'.format(officer_id=officer_id, tab=tab))

    def visit_search_page(self, query):
        self.visit('/s/{query}'.format(query=query))
