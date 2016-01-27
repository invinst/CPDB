from import_export import resources, fields


from common.models import Allegation


class AllegationResource(resources.ModelResource):
    crid = fields.Field(attribute='crid', column_name='CRID')
    status = fields.Field(column_name='Status')
    number_of_request = fields.Field(attribute='number_of_request', column_name='No. of requests')
    last_requested = fields.Field(column_name='Last requested')
    emails = fields.Field(attribute='emails', column_name='Emails')

    class Meta:
        model = Allegation
        fields = ()
        export_order = ['crid', 'status', 'number_of_request', 'last_requested']
        widgets = {
            'last_requested': {'format': '%I:%M %p, %d %b %Y'}
        }

    def dehydrate_status(self, allegation):
        if allegation.document_id:
            return 'Fulfilled'

        if allegation.document_requested:
            if allegation.document_pending:
                return 'Pending'
            return 'Request'

        return 'Missing'

    def dehydrate_last_requested(self, allegation):
        return allegation.last_requested.strftime('%I:%M %p, %d %b %Y')
