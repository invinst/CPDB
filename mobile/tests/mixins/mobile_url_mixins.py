class MobileUrlMixins(object):
    def visit_officer_page(self, officer):
        self.visit('/mobile/officer/{slug}/{pk}'.format(slug=officer.officer_first, pk=officer.pk))

    def visit_complaint_page(self, allegation):
        self.visit('/mobile/complaint/{crid}'.format(crid=allegation.crid))

    def visit_mobile_home(self):
        self.visit('/mobile')
