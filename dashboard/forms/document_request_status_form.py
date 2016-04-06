from django import forms

from document.models import Document


class DocumentRequestStatusForm(forms.Form):
    id = forms.IntegerField(required=True)
    status = forms.ChoiceField(required=True, choices=[
        ('pending', 'pending'),
        ('requesting', 'requesting'),
        ('missing', 'missing')
    ])

    def clean_id(self):
        id = self.cleaned_data['id']
        if not Document.objects.filter(pk=id).exists():
            raise forms.ValidationError("Document not found")
        return id

    def clean(self):
        cleaned_data = super(DocumentRequestStatusForm, self).clean()
        if self.errors:
            return cleaned_data

        error_status_not_assignable = 'This document cannot be assigned that status'

        id = cleaned_data['id']
        status = cleaned_data['status']

        document = Document.objects.get(pk=id)

        if status == 'pending':
            if not document.requested or document.pending:
                raise forms.ValidationError(error_status_not_assignable)

        if status == 'missing':
            if not document.requested:
                raise forms.ValidationError(error_status_not_assignable)

        return cleaned_data

    def process(self):
        id = self.cleaned_data['id']

        # 'requested' => requested = True, pending = False
        # 'pending' => requested = True, pending = True
        # 'missing' => requested = False, pending = False
        requested = self.cleaned_data['status'] != 'missing'
        pending = self.cleaned_data['status'] == 'pending'

        Document.objects.filter(pk=id).update(requested=requested, pending=pending)
