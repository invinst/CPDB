import json
import os
import threading
import time
from unittest import skipIf, skipUnless

from bs4 import BeautifulSoup
from django.core import management
from django.core.urlresolvers import reverse
from django.test.testcases import LiveServerTestCase, SimpleTestCase as DjangoSimpleTestCase
from selenium.common.exceptions import NoSuchElementException, WebDriverException
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.select import Select
from selenium import webdriver

from common.factories import UserFactory


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


IS_MOBILE = os.environ.get('MOBILE') == '1'


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

    def login_provider(self, user=None):
        self.login_user(user)
        if not self.user.is_provider:
            self.user.is_provider = True
            self.user.save()


class BaseLiveTestCase(LiveServerTestCase, UserTestBaseMixin):
    _multiprocess_can_split_ = True

    source = 0
    source_dir = os.environ.get('CIRCLE_ARTIFACTS')

    def tearDown(self):
        if world.browser is not None:
            world.browser.quit()
            world.browser = None

    @property
    def browser(self):
        if world.browser is None:
            profile = None
            if IS_MOBILE:
                profile = webdriver.FirefoxProfile()
                profile.set_preference(
                    "general.useragent.override",
                    "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
                )
            world.browser = WebDriver(profile)
            world.browser.implicitly_wait(10)
            world.browser.set_window_size(width=1200, height=1200)
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

    def visit(self, page):
        self.browser.get('%s%s' % (self.live_server_url, page))

    def should_see_text(self, text):
        if not isinstance(text, str):
            text = str(text)
        self.find('body').text.should.contain(text)

    def should_see_texts(self, texts):
        body = self.find('body').text
        for text in texts:
            if not isinstance(text, str):
                text = str(text)
            for x in text.split("\n"):
                body.should.contain(x)

    def should_not_see_text(self, text):
        if not isinstance(text, str):
            text = str(text)
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
        try:
            selector_input = self.find(selector)
            selector_input.clear()
            selector_input.send_keys(value)
        except:
            raise

    def sleep(self, seconds):
        time.sleep(seconds)

    def until(self, method, timeout=60, message='', interval=0.5):
        """Calls the method provided with the driver as an argument until the \
        return value is not False."""
        end_time = time.time() + timeout
        error = None
        while True:
            try:
                value = method()
                if value or value is None:
                    return value
            except Exception as ex:
                error = ex
            time.sleep(interval)
            if time.time() > end_time:
                break

        if self.source_dir:
            BaseLiveTestCase.source += 1
            self.browser.save_screenshot(os.path.join(self.source_dir, '{s}.png'.format(s=BaseLiveTestCase.source)))
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

@skipUnless(IS_MOBILE, "Skip in desktop mode")
class BaseMobileLiveTestCase(BaseLiveTestCase):
    pass


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
