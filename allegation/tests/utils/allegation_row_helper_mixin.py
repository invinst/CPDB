class AllegationRowHelperMixin(object):
    def open_complaint_detail(self):
        self.visit_home()
        self.find('.checkmark').click()
