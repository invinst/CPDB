from django import forms
from django.http.response import Http404

from document.models import RequestEmail, Document
from share.models import Session


class RequestEmailForm(forms.ModelForm):
    document_id = forms.CharField(required=True)

    def __init__(self, *args, **kwargs):
        super(RequestEmailForm, self).__init__(*args, **kwargs)
        if self.data.get('session'):
            session_id = Session.id_from_hash(self.data.get('session'))[0]
            self.instance.session = Session.objects.get(pk=session_id)

    def clean_document_id(self):
        id = self.cleaned_data['document_id']
        if not Document.objects.filter(pk=id).exists():
            raise Http404()
        return id

    def save(self, commit=True):
        id = self.cleaned_data['document_id']
        document = Document.objects.get(pk=id)

        self.instance.document = document
        super(RequestEmailForm, self).save(commit=commit)

    class Meta:
        model = RequestEmail
        fields = ('email',)
