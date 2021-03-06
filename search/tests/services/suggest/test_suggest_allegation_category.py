from allegation.factories import AllegationCategoryFactory
from search.tests.services.suggest.base_test_suggest import BaseSuggestTestCase
from search.services.suggest.suggest_allegation_category import (
    SuggestAllegationCategoryCategory, SuggestAllegationCategoryCat, SuggestAllegationCategoryOnDuty)


class AllegationCategorySuggestTestCase(BaseSuggestTestCase):
    def test_suggest_allegation_category(self):
        allegation_category = AllegationCategoryFactory(category='Execessive Force')

        self.rebuild_index()

        # TODO: Not sure why exce not working here
        SuggestAllegationCategoryCategory.query('for')['Category'][0]['suggest_value']\
            .should.be.equal(allegation_category.category)
        SuggestAllegationCategoryCategory.query('not in suggest')['Category'].should.be.equal([])

    def test_suggest_allegation_category_cat(self):
        allegation_category = AllegationCategoryFactory(
            allegation_name='Twisted Extremities (Wrist/Arm/Leg)',
            cat_id='S123'
        )

        self.rebuild_index()

        ret1 = SuggestAllegationCategoryCat.query('123')
        ret2 = SuggestAllegationCategoryCat.query('some thing wrong')

        ret1['Category ID'][0]['suggest_value'].should.be.equal(allegation_category.cat_id)
        ret1['Allegation type'][0]['suggest_value'].should.be.equal('Twisted Extremities (Wrist/Arm/Leg)')
        ret2['Category ID'].should.be.equal([])
        ret2['Allegation type'].should.be.equal([])

    def test_suggest_allegation_category_on_duty(self):
        AllegationCategoryFactory(on_duty=True)
        AllegationCategoryFactory(on_duty=False)

        ret1 = SuggestAllegationCategoryOnDuty.query('On D')
        ret1['Category On Duty'][0]['tag_value']['value'].should.be.equal(True)

        ret2 = SuggestAllegationCategoryOnDuty.query('Off D')
        ret2['Category On Duty'][0]['tag_value']['value'].should.be.equal(False)
