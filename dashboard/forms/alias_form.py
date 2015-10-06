from django import forms

from search.models.alias import Alias


class AliasForm(forms.ModelForm):
    class Meta:
        model = Alias
        fields = ('alias', 'target')
