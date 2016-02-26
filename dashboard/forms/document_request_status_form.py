from django import forms

from common.models import Allegation


class DocumentRequestStatusForm(forms.Form):
    crid = forms.IntegerField(required=True)
    status = forms.ChoiceField(required=True, choices=[
        ['pending', 'pending'],
        ['requesting', 'requesting'],
    ])

    def clean_crid(self):
        crid = self.cleaned_data['crid']
        if not Allegation.objects.filter(crid=crid).exists():
            raise forms.ValidationError("CRID not found")
        return crid

    def clean(self):
        cleaned_data = super(DocumentRequestStatusForm, self).clean()
        if self.errors:
            return cleaned_data

        error_status_not_assignable = \
            'This document cannot be assigned that status'

        crid = cleaned_data['crid']
        status = cleaned_data['status']

        allegation = Allegation.objects.get(crid=crid)
        document, _ = allegation.documents.get_or_create(type='CR')

        if status == 'pending':
            if not document.requested or document.pending:
                raise forms.ValidationError(error_status_not_assignable)

        return cleaned_data

    def process(self):
        crid = self.cleaned_data['crid']
        status = self.cleaned_data['status']

        allegation = Allegation.objects.get(crid=crid)
        document, _ = allegation.documents.get_or_create(type='CR')
        document.pending = status == 'pending'
        document.save()
