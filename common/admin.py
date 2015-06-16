from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from common.models import User, Officer, OfficerHistory, Allegation, ComplainingWitness, PoliceWitness, \
    AllegationCategory


class PoliceWitnessAdmin(admin.ModelAdmin):
    search_fields = ['crid', 'officer__officer_first', 'officer__officer_last']
    list_display = ['crid', 'race', 'gender', 'officer']
    list_filter = ['race', 'gender']


class ComplainingWitnessAdmin(admin.ModelAdmin):
    search_fields = ['crid']
    list_display = ['crid', 'race', 'gender']
    list_filter = ['race', 'gender']


class AllegationAdmin(admin.ModelAdmin):
    search_fields = ['officer__officer_last', 'officer__officer_first']
    list_filter = ['officer__race', 'officer__gender', 'city', 'cat']


class AllegationInline(admin.StackedInline):
    model = Allegation
    extra = 0


class OfficerHistoryInline(admin.StackedInline):
    model = OfficerHistory
    extra = 0


class OfficerAdmin(admin.ModelAdmin):
    list_display = ['id', 'officer_first', 'officer_last', 'gender', 'race']
    list_filter = ['gender', 'race', 'unit', 'rank']
    search_fields = ['officer_first', 'officer_last']
    inlines = [OfficerHistoryInline, AllegationInline]


admin.site.register(AllegationCategory, admin.ModelAdmin)
admin.site.register(PoliceWitness, PoliceWitnessAdmin)
admin.site.register(ComplainingWitness, ComplainingWitnessAdmin)
admin.site.register(Officer, OfficerAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Allegation, AllegationAdmin)
