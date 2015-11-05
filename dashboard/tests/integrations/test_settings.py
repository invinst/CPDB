from common.tests.core import BaseLiveTestCase
from share.factories import SettingFactory
from api.models import Setting


class SettingsEditTestCase(BaseLiveTestCase):
    def setUp(self):
        self.setting = SettingFactory()
        self.login_user()
        self.visit('/admin/')
        self.element_by_tagname_and_text('span', 'Settings').click()

    def tearDown(self):
        self.setting.delete()
        super(SettingsEditTestCase, self).tearDown()

    def test_update_setting(self):
        input_field = self.element_for_label(self.setting.key)

        self.should_see_text(self.setting.key)
        input_field.get_attribute('value').should.equal(self.setting.value)

        new_setting_value = 'new_setting_value'
        input_field.clear()
        input_field.send_keys(new_setting_value)

        self.button("Save").click()

        self.until(self.ajax_complete)
        self.should_see_text("All settings are updated.")

        setting_data = Setting.objects.get(key=self.setting.key)
        setting_data.value.should.equal(new_setting_value)

