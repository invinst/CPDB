from django import forms

from search.models.session_alias import SessionAlias
from share.models import Session


class SessionAliasForm(forms.ModelForm):
    target = forms.URLField()

    class Meta:
        model = SessionAlias
        fields = ('alias',)

    def save(self, user, commit=True):
        instance = super(SessionAliasForm, self).save(commit=False)
        session_hash = self.cleaned_data['target'].split("/")[4]
        session_id = Session.id_from_hash(session_hash)[0]
        instance.session_id = session_id
        instance.user = user

        if commit:
            instance.save()
            self.save_m2m()

        return instance
