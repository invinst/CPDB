from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from common.actions import make_export_action, geocode_allegation
from common.models import User, Officer, OfficerHistory, Allegation
from common.models import ComplainingWitness, PoliceWitness, AllegationCategory
from common.models import Investigator, OfficerAllegation, PendingPdfAllegation


class PoliceWitnessAdmin(admin.ModelAdmin):
    search_fields = ['allegation__crid', 'officer__officer_first', 'officer__officer_last']
    list_display = ['allegation', 'race', 'gender', 'officer']
    list_filter = ['race', 'gender']
    actions = make_export_action("Export Police Witnesses to CSV")


class ComplainingWitnessAdmin(admin.ModelAdmin):
    search_fields = ['allegation__crid']
    list_display = ['allegation', 'race', 'gender']
    list_filter = ['race', 'gender']
    actions = make_export_action("Export Complaining Witnesses to CSV")


class AllegationAdmin(admin.ModelAdmin):
    search_fields = ['crid', 'city']
    list_display = ['id', 'crid', 'add1', 'add2', 'city']
    actions = [geocode_allegation]


class OfficerAllegationAdmin(admin.ModelAdmin):
    search_fields = [
        'officer__officer_last', 'officer__officer_first', 'allegation__crid',
        'allegation__investigator__name']
    list_filter = ['officer__race', 'officer__gender', 'cat__category']
    list_display = [
        'allegation', 'cat', 'officer', 'final_finding', 'final_outcome']
    actions = make_export_action("Export Officer allegations to CSV")


class OfficerAllegationInline(admin.StackedInline):
    model = OfficerAllegation
    extra = 0


class OfficerHistoryInline(admin.StackedInline):
    model = OfficerHistory
    extra = 0


class OfficerAdmin(admin.ModelAdmin):
    list_display = ['id', 'officer_first', 'officer_last', 'gender', 'race']
    list_filter = ['gender', 'race', 'unit', 'rank']
    search_fields = ['officer_first', 'officer_last']
    inlines = [OfficerHistoryInline, OfficerAllegationInline]
    actions = make_export_action("Export Officers to CSV")


class InvestigatorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'current_rank', 'complaint_count']
    actions = make_export_action("Export Investigators to CSV")


class PendingPdfAllegationAdmin(admin.ModelAdmin):
    list_display = ['id', 'crid', 'raw_content', 'errors']


admin.site.register(Allegation, AllegationAdmin)
admin.site.register(Investigator, InvestigatorAdmin)
admin.site.register(AllegationCategory, admin.ModelAdmin)
admin.site.register(PoliceWitness, PoliceWitnessAdmin)
admin.site.register(ComplainingWitness, ComplainingWitnessAdmin)
admin.site.register(Officer, OfficerAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(OfficerAllegation, OfficerAllegationAdmin)
admin.site.register(PendingPdfAllegation, PendingPdfAllegationAdmin)
