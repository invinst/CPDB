from django import forms
from common.models import Officer


class OfficerForm(forms.ModelForm):
    class Meta:
        model = Officer
        fields = ('birth_year', 'star', 'officer_last', 'id', 'officer_first', 'gender', 'rank', 'unit', 'appt_date',
                  'race',)
