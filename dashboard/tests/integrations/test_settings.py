from common.tests.core import BaseAdminTestCase
from api.models import Setting
from officer.factories import StoryFactory


class SettingsEditTestCase(BaseAdminTestCase):
    def setUp(self):
        super(SettingsEditTestCase, self).setUp()

        self.story = StoryFactory()
        self.setting = self.get_admin_settings()
        self.setting.story_types_order = ''
        self.setting.save()

        self.go_to_section('Settings')

    def tearDown(self):
        super(SettingsEditTestCase, self).tearDown()

    def test_update_setting(self):
        # Default Site Title
        input_field = self.until(lambda: self.element_for_label('Default Site Title'))

        input_field.get_attribute('value').should.equal(self.setting.default_site_title)

        new_setting_value = 'new_setting_value'
        input_field.clear()
        input_field.send_keys(new_setting_value)

        # Story Types Order
        select = self.find('.Select-input > input')
        select.send_keys(self.story.story_type)
        self.until(self.ajax_complete)
        self.element_by_classname_and_text('Select-option', self.story.story_type).click()

        self.button("Save").click()

        self.until(self.ajax_complete)
        self.should_see_text("All settings are updated.")

        setting_data = Setting.objects.all()[0]
        setting_data.default_site_title.should.equal(new_setting_value)
        setting_data.story_types_order.should.equal(self.story.story_type)
