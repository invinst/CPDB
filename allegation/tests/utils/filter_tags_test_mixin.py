class FilterTagsTestMixin(object):
    def assert_have_filter_tags(self, category, value):
        filter_tags = self.find('.filter').text
        filter_tags.should.contain(category)
        filter_tags.should.contain(value)
