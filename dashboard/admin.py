from import_export import resources, fields

from django.contrib import admin

from common.models import Allegation

# Register your models here.
class AllegationResource(resources.ModelResource):
    crid = fields.Field(attribute='crid', column_name='CRID')
    status = fields.Field(column_name='Status')
    number_of_request = fields.Field(attribute='number_of_request', column_name='No. of requests')
    last_requested = fields.Field(column_name='Last requested')

    class Meta:
        model = Allegation
        fields = ()
        export_order = ['crid', 'status', 'number_of_request', 'last_requested']
        widgets = {
            'last_requested': {'format': '%I:%m %p, %d %b %Y'}
        }


    def dehydrate_status(self, allegation):
        if allegation.document_id:
            return 'Fulfilled'

        if allegation.document_requested:
            if allegation.document_pending:
                return 'Pending'
            return 'Requesting'

        return 'Missing'

    def dehydrate_last_requested(self, allegation):
        return allegation.last_requested.strftime('%I:%m %p, %d %b %Y')
