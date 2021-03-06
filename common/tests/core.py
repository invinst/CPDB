import json
import os
import threading
import time
import sure  # NOQA
from datetime import timedelta, datetime
from contextlib import contextmanager

from bs4 import BeautifulSoup
from django.core import management
from django.core.urlresolvers import reverse
from django.test.testcases import LiveServerTestCase, TestCase as DjangoSimpleTestCase
from nose.plugins.attrib import attr
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver import ActionChains
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.select import Select
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from functools import wraps

from api.models import Setting
from common.factories import UserFactory
from mobile.tests.mixins.mobile_visiting_url_mixins import MobileVisitingUrlMixins
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
world.phone_browser = None
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


class BrowserNoWait(object):
    def __init__(self, obj):
        self.obj = obj

    def __enter__(self):
        self.obj.browser.implicitly_wait(0)

    def __exit__(self, exc_type, exc_value, traceback):
        self.obj.browser.implicitly_wait(10)


class OpenNewBrowser(object):
    def __init__(self, browser):
        self.browser = browser

    def __enter__(self):
        browser = self.browser

        self.browser = world.browser
        world.browser = browser

    def __exit__(self, exc_type, exc_value, traceback):
        world.browser.quit()

        world.browser = self.browser


def retry_random_fail(f, num_retries=3):
    @wraps(f)
    def decorated(*args):
        test_case = args[0]

        fail_counter = 0

        while True:
            try:
                return f(test_case)
            except:
                test_case.browser.close()

                fail_counter += 1

                if fail_counter == num_retries:
                    raise

    return decorated


class BaseLiveTestCase(LiveServerTestCase, UserTestBaseMixin):
    _multiprocess_can_split_ = True

    source = 0
    source_dir = os.environ.get('CIRCLE_ARTIFACTS')

    DESKTOP_BROWSER_SIZE = {'width': 1230, 'height': 1200}

    def set_browser(self, browser):
        world.browser = browser

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
        desired_capabilities = DesiredCapabilities.FIREFOX
        desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

        browser = WebDriver(
            capabilities=desired_capabilities,
            firefox_profile=self.init_firefox_profile())
        browser.implicitly_wait(10)
        browser.set_window_size(**self.DESKTOP_BROWSER_SIZE)
        return browser

    def browser_no_wait(self):
        return BrowserNoWait(self)

    def open_new_browser(self):
        browser = self.init_firefox()
        return OpenNewBrowser(browser)

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
        self.browser.execute_script('blanket.onTestsDone();')
        report = self.browser.execute_script('return window.coverage_results;')
        world.js_coverages.append(report)

    def hide_toastr(self):
        self.browser.execute_script("jQuery('#toast-container').html('');")

    def visit(self, page):
        if not page.startswith('http'):
            page = '%s%s' % (self.live_server_url, page)
        self.browser.get(page)

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

    def drag_and_drop(self, source_element, target_element):
        action_chains = ActionChains(self.browser)
        action_chains.drag_and_drop(source_element, target_element)
        action_chains.perform()
        self.sleep(1)

    def should_see_text(self, text, parent='body'):
        if not isinstance(text, str):
            text = str(text)
        self.find(parent).text.should.contain(text)

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
        while time.time() <= end_time:
            try:
                value = method()
                if value or value is None:
                    return value
            except Exception:
                pass
            time.sleep(interval)
        raise TimeoutException(message)

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

    def click_by_js(self, element):
        self.browser.execute_script('return arguments[0].click();', element)

    # TODO: These methods should belong to a mixin instead
    def reset_ga_call(self):
        return self.browser.execute_script("window.gaCall=0")

    def should_track_ga_event(self):
        self.get_ga_call_variable().should.greater_than(0)

    def get_ga_call_variable(self):
        return self.browser.execute_script("return window.gaCall")

    def set_default_window_size(self):
        self.browser.set_window_size(**self.DESKTOP_BROWSER_SIZE)

    def is_element_displayed(self, selector):
        return self.browser.execute_script('return $("%s").css("display")' % selector) != 'none'

    def try_to_revive_browser(self):
        self.browser.get('/')


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
        world.mobile_browser.set_window_size(1023, 1000)
        return world.mobile_browser


class BaseLivePhoneTestCase(MobileVisitingUrlMixins, BaseLiveTestCase):
    IPHONE6_BROWSER_SIZE = {'width': 375, 'height': 627}
    IPHONE6_USER_AGENT = (
        'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, '
        'like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4')

    def init_firefox_profile(self):
        profile = super(BaseLivePhoneTestCase, self).init_firefox_profile()
        profile.set_preference(
            "general.useragent.override",
            self.IPHONE6_USER_AGENT
        )
        return profile

    def init_firefox(self):
        desired_capabilities = DesiredCapabilities.FIREFOX
        desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

        browser = WebDriver(
            capabilities=desired_capabilities,
            firefox_profile=self.init_firefox_profile())
        browser.implicitly_wait(3)
        browser.set_window_size(**self.IPHONE6_BROWSER_SIZE)
        return browser

    @property
    def browser(self):
        if world.phone_browser is None:
            world.phone_browser = self.init_firefox()
        return world.phone_browser


@attr('simple')
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


@contextmanager
def switch_to_popup(driver):
    """
    Switch to opened popup, switch to main window when leave context.

    This context assume that there're only one popup opened.

    Usage example:

    with switch_to_popup(driver):
        ('https://www.facebook.com' in browser.current_url).should.be.true
    """
    timeout = datetime.now() + timedelta(seconds=5)
    while len(driver.window_handles) < 2 and datetime.now() <= timeout:
        pass
    driver.switch_to.window(driver.window_handles[1])
    yield None
    driver.switch_to.window(driver.window_handles[0])


def repr_equal_either(obj, *strs):
    """
    Make sure that repr result match either representation.

    Usage example:
        repr_equal_either(obj, '<objectA>', '<objectB>')
    """
    strs.should.contain(repr(obj))
