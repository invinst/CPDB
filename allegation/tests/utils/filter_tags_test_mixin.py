class FilterTagsTestMixin(object):
    def assert_have_filter_tags(self, category, value):
        filter_tags = self.find('#filter-tags').text.lower()
        filter_tags.should.contain(category.lower())
        filter_tags.should.contain(str(value).lower())

    def assert_no_filter_tags(self):
        self.find_all('.filter').should.have.length_of(0)
