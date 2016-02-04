from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.views.generic.base import View

from selenium import webdriver


class SunburstImageView(View):
    def get(self, request, hash_id=None):
        driver = webdriver.PhantomJS()
        driver.implicitly_wait(10)
        driver.set_window_size(width=690, height=395)
        try:
            driver.get(request.build_absolute_uri(reverse('allegation:sunburst', args=[hash_id])))
            driver.find_element_by_css_selector('svg g path')
            img = driver.get_screenshot_as_png()
        finally:
            driver.quit()
        return HttpResponse(img, content_type="image/png")
