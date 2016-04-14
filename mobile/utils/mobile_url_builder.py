from slugify import slugify

from common.utils.mobile_url_hash_util import MobileUrlHashUtil


class MobileUrlBuilder(object):
    def complaint_page(self, officer_allegation):
        if officer_allegation.cat:
            cat = officer_allegation.cat.category
            cat_pk = officer_allegation.cat.pk
        else:
            cat = 'no category'
            cat_pk = 0

        crid = officer_allegation.allegation.crid
        hash = MobileUrlHashUtil().encode(cat_pk)

        return '/complaint/{crid}/{slug}/{hash}'.format(crid=crid, slug=slugify(cat), hash=hash)

    def complaint_page_by_crid_and_category(self, crid, cat):
        cat_pk = cat['cat__id'] or 0
        cat_category = cat['cat__category'] or 'no category'

        hash = MobileUrlHashUtil().encode(cat_pk)
        return '/complaint/{crid}/{slug}/{hash}'.format(crid=crid, slug=slugify(cat_category), hash=hash)

    def officer_page(self, officer):
        slugified_display_name = slugify(officer.display_name)
        return '/officer/{display_name}/{id}'.format(display_name=slugified_display_name, id=officer.id)
