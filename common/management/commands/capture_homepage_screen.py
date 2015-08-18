import datetime
import os
from time import sleep

from django.conf import settings
from django.core.mail.message import EmailMessage
from django.core.management.base import BaseCommand
from selenium.webdriver.firefox.webdriver import WebDriver


class Command(BaseCommand):
    help = 'Capture landing page screen'

    def handle(self, *args, **options):
        browser = WebDriver()
        browser.get("http://data.invisible.institute/")
        sleep(1)
        browser.find_element_by_css_selector("#disclaimer button").click()
        sleep(0.7)
        browser.find_elements_by_css_selector(".officer .checkmark")[4].click()
        sleep(2)
        browser.find_element_by_css_selector(".complaint-row .col-md-3").click()
        sleep(1)
        content = browser.get_screenshot_as_png()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S")
        file_name = "{now}.png".format(now=now)
        file_path = os.path.join(settings.BASE_DIR, 'static', file_name)
        with open(file_path, "wb") as f:
            f.write(content)
        browser.quit()

        email = EmailMessage(subject='CPDB Homepage screenshot %s' % now, body='FYI',
                             to=['cpdb@eastagile.com'])
        email.attach_file(file_path)
        email.send()
