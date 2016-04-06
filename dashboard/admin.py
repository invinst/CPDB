from django.contrib import admin
from import_export import resources, fields

from common.actions import make_export_action
from document.models import Document


class DocumentResource(resources.ModelResource):
    crid = fields.Field(attribute='allegation__crid', column_name='CRID')
    status = fields.Field(column_name='Status')
    number_of_request = fields.Field(attribute='number_of_request', column_name='No. of requests')
    last_requested = fields.Field(column_name='Last requested')
    emails = fields.Field(attribute='emails', column_name='Emails')

    def dehydrate_status(self, document):
        if document.documentcloud_id:
            return 'Fulfilled'

        if document.requested:
            if document.pending:
                return 'Pending'
            return 'Request'

        return 'Missing'

    def dehydrate_last_requested(self, document):
        return document.last_requested.strftime('%I:%M %p, %d %b %Y')

    class Meta:
        model = Document
        export_order = ['crid', 'status', 'number_of_request', 'last_requested']
        fields = ()


class DocumentAdmin(admin.ModelAdmin):
    search_fields = ['title', 'type']
    list_display = ['id', 'type', 'title', 'number_of_request', 'requested', 'pending', 'documentcloud_id']
    actions = make_export_action("Export Documents to CSV")
    ordering = ('-number_of_request',)

admin.site.register(Document, DocumentAdmin)
