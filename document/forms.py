from django import forms
from django.http.response import Http404

from common.models import Allegation
from document.models import RequestEmail
from share.models import Session


class RequestEmailForm(forms.ModelForm):
    type = forms.CharField()

    def __init__(self, *args, **kwargs):
        super(RequestEmailForm, self).__init__(*args, **kwargs)
        if 'session' in self.data:
            session_id = Session.id_from_hash(self.data.get('session'))[0]
            self.instance.session = Session.objects.get(pk=session_id)

    def clean_crid(self):
        crid = self.cleaned_data['crid']
        if not Allegation.objects.filter(crid=crid).exists():
            raise Http404()
        return crid

    def save(self, commit=True):
        crid = self.cleaned_data['crid']
        type = self.cleaned_data['type']

        document, _ = Allegation.objects.get(crid=crid).documents.get_or_create(type=type)
        document.requested = True
        document.save()
        self.instance.document = document
        super(RequestEmailForm, self).save(commit=commit)

    class Meta:
        model = RequestEmail
        fields = ('crid', 'email')
