from common.tests.core import SimpleTestCase
from share.factories import SettingFactory
from api.models import Setting


class SettingViewTestCase(SimpleTestCase):
    def setUp(self):
        self.login_user()
        self.settings = []

    def tearDown(self):
        for setting in self.settings:
            setting.delete()

    def settings_save(self, params={}):
        response = self.client.post('/api/dashboard/settings_save/', params)

        return response

    def test_post_settings_save_returns_200(self):
        response = self.settings_save()
        response.status_code.should.equal(200)

    def test_post_settings_save_update_settings(self):
        key_1 = 'key_1'
        key_2 = 'key_2'
        new_val_1 = 'new_val_1'

        setting_1 = SettingFactory(key=key_1)
        setting_2 = SettingFactory(key=key_2)
        self.settings.append(setting_1)
        self.settings.append(setting_2)

        params = {
            key_1: new_val_1,
            key_2: setting_2.value
        }

        response = self.settings_save(params)
        Setting.objects.get(key=key_1).value.should.equal(new_val_1)
