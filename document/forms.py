from django import forms
from django.http.response import Http404
from common.models import Allegation

from document.models import RequestEmail


class RequestEmailForm(forms.ModelForm):
    class Meta:
        model = RequestEmail
        fields = ('crid', 'email')

    def clean_crid(self):
        crid = self.cleaned_data['crid']
        if not Allegation.objects.filter(crid=crid).exists():
            raise Http404()
        return crid

    def save(self, commit=True):
        Allegation.objects.filter(crid=self.cleaned_data['crid']).update(document_requested=True)
        super(RequestEmailForm, self).save(commit=commit)
