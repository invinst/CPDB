from common.tests.core import BaseLiveTestCase
from api.models import Setting
from officer.factories import StoryFactory


class SettingsEditTestCase(BaseLiveTestCase):
    def setUp(self):
        self.story = StoryFactory()
        self.setting = self.get_admin_settings()
        self.type_1 = StoryFactory().story_type
        self.type_2 = self.story.story_type
        self.setting.story_types_order = ",".join([self.type_1, self.type_2])
        self.setting.save()

        self.login_user()
        self.visit('/admin/')
        self.element_by_tagname_and_text('span', 'Settings').click()
        self.until_ajax_complete()

    def tearDown(self):
        super(SettingsEditTestCase, self).tearDown()

    def test_update_setting(self):
        # Default Site Title
        input_field = self.until(lambda: self.element_for_label('Default Site Title'))

        input_field.get_attribute('value').should.equal(self.setting.default_site_title)

        new_setting_value = 'new_setting_value'
        input_field.clear()
        input_field.send_keys(new_setting_value)

        self.button("Save").click()

        self.until(self.ajax_complete)
        self.should_see_text("All settings are updated.")

        # We can't test this drag and drop story types order
        expected_story_types_order =  ",".join([self.type_2, self.type_1])
        setting_data = Setting.objects.all()[0]
        setting_data.default_site_title.should.equal(new_setting_value)
