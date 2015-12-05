import json
import os
import threading
import time
from unittest import skipIf, skipUnless

from bs4 import BeautifulSoup
from django.core import management
from django.core.urlresolvers import reverse
from django.test.testcases import LiveServerTestCase, TestCase as DjangoSimpleTestCase
from nose.plugins.attrib import attr
from selenium.common.exceptions import NoSuchElementException, WebDriverException
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.select import Select
from selenium import webdriver

from api.models import Setting
from common.factories import UserFactory
from share.factories import SettingFactory


WebElement.find = WebElement.find_element_by_css_selector
WebElement.find_all = WebElement.find_elements_by_css_selector
WebElement.xpath = WebElement.find_element_by_xpath


def select_by_visible_text(self, text):
    Select(self).select_by_visible_text(text)


WebElement.select_by_visible_text = select_by_visible_text


def has_class(self, value):
    return value in self.get_attribute('class')


WebElement.has_class = has_class


class TimeoutException(AssertionError):
    pass


world = threading.local()
world.browser = None
world.mobile_browser = None
world.js_coverages = []


class UserTestBaseMixin(object):
    user = None

    def init_user(self):
        self.user = UserFactory()

    def login_user(self, user=None):
        if user is None:
            if self.user is None:
                self.init_user()
            user = self.user
        self.user = user
        self.login(user)


class BaseLiveTestCase(LiveServerTestCase, UserTestBaseMixin):
    _multiprocess_can_split_ = True

    source = 0
    source_dir = os.environ.get('CIRCLE_ARTIFACTS')

    def tearDown(self):
        if world.browser is not None:
            world.browser.delete_all_cookies()

    def get_admin_settings(self):
        return Setting.objects.all().first() or SettingFactory()

    def init_firefox_profile(self):
        profile = webdriver.FirefoxProfile()
        profile.set_preference('browser.cache.disk.enable', False)
        profile.set_preference('browser.cache.memory.enable', False)
        profile.set_preference('browser.cache.offline.enable', False)
        profile.set_preference('dom.max_script_run_time', 100)
        profile.set_preference('browser.startup.homepage_override.mstone', 'ignore')
        return profile

    def init_firefox(self):
        browser = WebDriver(self.init_firefox_profile())
        browser.implicitly_wait(10)
        browser.set_window_size(width=1230, height=1200)
        return browser

    @property
    def browser(self):
        if world.browser is None:
            world.browser = self.init_firefox()
        return world.browser

    @classmethod
    def setUpClass(cls):
        if not hasattr(LiveServerTestCase, 'static_collected') or not LiveServerTestCase.static_collected:
            management.call_command('collectstatic', interactive=False, verbosity=0)
            LiveServerTestCase.static_collected = True
        super(BaseLiveTestCase, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        super(BaseLiveTestCase, cls).tearDownClass()

    def get_current_javascript_report(self):
        self.browser.execute_script('blanket.onTestsDone();');
        report = self.browser.execute_script('return window.coverage_results;')
        world.js_coverages.append(report)

    def hide_toastr(self):
        self.browser.execute_script("jQuery('#toast-container').html('');")

    def visit(self, page):
        # if 'localhost' in self.browser.current_url:
        #     self.get_current_javascript_report()
        self.browser.get('%s%s' % (self.live_server_url, page))

    def visit_home(self, fresh=False):
        if fresh:
            self.visit('/')
        else:
            url = self.browser.current_url
            if '/data' in url:
                self.find("#logo_link img").click()
            elif any(x in url for x in ('/findings', '/story', '/method')):
                self.link("Data").click()
            else:
                self.visit('/')
            self.until(lambda: self.browser.current_url != url)
        self.until(lambda: self.link("Outcomes"), timeout=60)
        self.until_ajax_complete()
        self.find("body").click()

    def should_see_text(self, text):
        if not isinstance(text, str):
            text = str(text)
        self.find('body').text.should.contain(text)

    def should_see_texts(self, texts):
        body = self.find('body').text
        for text in texts:
            for x in text.split("\n"):
                body.should.contain(x)

    def should_not_see_text(self, text):
        self.assertNotIn(text, self.find('body').text)

    def login(self, user):
        self.visit(reverse("admin:login"))
        self.find("#id_username").send_keys(user.username)
        self.find("#id_password").send_keys(user.raw_password)
        self.find("input[type='submit']").click()

    def element_exist(self, css_selector):
        try:
            self.find(css_selector)
            return True
        except NoSuchElementException:
            return False

    def element_by_tagname_and_text(self, tag, text, parent="body"):
        _xpath = ".//%s[normalize-space(.)='%s']" % (tag, text)
        for node in self.find_all(parent):
            try:
                return node.xpath(_xpath)
            except NoSuchElementException:
                pass
        return False

    def element_by_classname_and_text(self, class_name, text, parent="body"):
        _xpath = ".//*[contains(@class, '%s')][normalize-space(.)='%s']" % (class_name, text)
        for node in self.find_all(parent):
            try:
                return node.xpath(_xpath)
            except NoSuchElementException:
                pass
        return False

    def button(self, button_text, parent="body"):
        return self.element_by_tagname_and_text("button", button_text, parent)

    def link(self, label_text, parent="body"):
        return self.element_by_tagname_and_text("a", label_text, parent)

    def label(self, label_text, parent="body"):
        return self.element_by_tagname_and_text("label", label_text, parent)

    def element_for_label(self, label):
        if isinstance(label, str):
            label = self.label(label)
        return self.find("#%s" % label.get_attribute("for"))

    def find_all(self, selector):
        return self.browser.find_elements_by_css_selector(selector)

    def find(self, selector):
        try:
            return self.browser.find_element_by_css_selector(selector)
        except NoSuchElementException:
            if self.source_dir:
                BaseLiveTestCase.source += 1
                with open("%s/current_html_%s.html" % (self.source_dir, BaseLiveTestCase.source), "w") as f:
                    f.write(selector)
                    f.write("\r\n")
                    f.write(self.browser.page_source)
            raise

    def fill_in(self, selector, value):
        selector_input = self.find(selector)
        selector_input.clear()
        selector_input.send_keys(value)

    def sleep(self, seconds):
        time.sleep(seconds)

    def get_screen_shot(self, name=None):
        if self.source_dir:
            BaseLiveTestCase.source += 1
            name = '{s}.png'.format(s=name or BaseLiveTestCase.source)
            file_path = os.path.join(self.source_dir, name)
            while os.path.exists(file_path):
                file_path = os.path.join(self.source_dir, '{time}_{name}'.format(name=name, time=time.time()))
            self.browser.save_screenshot(file_path)

    def until(self, method, timeout=10, message='', interval=0.5):
        """Calls the method provided with the driver as an argument until the \
        return value is not False."""
        end_time = time.time() + timeout
        error = None
        while time.time() <= end_time:
            try:
                value = method()
                if value or value is None:
                    return value
            except Exception as ex:
                error = ex
            time.sleep(interval)
        raise TimeoutException(message) from error

    def is_displayed_in_viewport(self, element):
        """
        Check if an element is displayed on current view port
        For now check against only y-position
        """
        if isinstance(element, str):
            element = self.find(element)

        element_location = element.location
        viewport_y = self.browser.execute_script("return window.scrollY")
        viewport_height = self.browser.execute_script("return window.innerHeight")

        return viewport_y + viewport_height >= element_location['y'] >= viewport_y

    def ajax_complete(self):
        return 0 == self.browser.execute_script("return jQuery.active")

    def until_ajax_complete(self):
        self.until(self.ajax_complete)

    def scroll_to(self, top=0):
        self.browser.execute_script("jQuery(window).scrollTop({top});".format(top=top))

    def click_first_officer(self):
        self.scroll_to(1000)
        self.find('.officer .checkmark').click()

    def click_active_tab(self, tab):
        self.scroll_to()
        self.link(tab).click()


class BaseAdminTestCase(BaseLiveTestCase):
    def setUp(self):
        self.login_user()
        self.visit('/admin/')

    def go_to_section(self, section):
        self.element_by_tagname_and_text('span', section).click()
        self.until_ajax_complete()


class BaseMobileLiveTestCase(BaseLiveTestCase):
    def init_firefox_profile(self):
        profile = super(BaseMobileLiveTestCase, self).init_firefox_profile()
        profile.set_preference(
            "general.useragent.override",
            "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) "
            "Version/7.0 Mobile/11A465 Safari/9537.53"
        )
        return profile

    @property
    def browser(self):
        if world.mobile_browser is None:
            world.mobile_browser = self.init_firefox()
        return world.mobile_browser


@skipIf(IS_MOBILE, "Skip in mobile mode")
class SimpleTestCase(DjangoSimpleTestCase, UserTestBaseMixin):
    response = None
    _soup = None

    @property
    def soup(self):
        if self._soup is None:
            self._soup = BeautifulSoup(self.response.content)
        return self._soup

    def login(self, user):
        self.client.login(username=user.username, password=user.raw_password)

    def visit(self, path, *args, **kwargs):
        self.response = self.client.get(path, *args, **kwargs)
        self._soup = None

    def find(self, selector):
        return self.find_all(selector)[0]

    def find_all(self, selector):
        return self.soup.select(selector)

    def link(self, text):
        return self.soup.find('a', text=text)

    def should_see_text(self, text):
        self.soup.text.should.contain(text)

    def should_not_see_text(self, text):
        self.soup.text.shouldnt.contain(text)

    def json(self, response):
        return json.loads(response.content.decode())
