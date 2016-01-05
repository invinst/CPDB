from common.management.commands.base_process_allegation_from_pdf import ProcessAllegationFromPdfBaseCommand

from common.models import Allegation, Area, AllegationCategory, PendingPdfAllegation


class Command(ProcessAllegationFromPdfBaseCommand):
    def process_allegation(self, crid, content):
        fields = self.extract_fields(crid, content)

        if Allegation.objects.filter(crid=crid).exists():
            Allegation.objects.filter(crid=crid).update(summary=fields['summary'])
        else:
            pending_pdf_allegation, _ = PendingPdfAllegation.objects.update_or_create(
                crid=crid,
                defaults = {
                    'crid': crid,
                    'raw_content': content,
                    'notification_date': fields.get('notification_date'),
                    'cat': fields.get('complaint'),
                    'finding': fields.get('finding'),
                    'summary': fields.get('summary'),
                    'errors': fields.get('errors')
                }
            )
            pending_pdf_allegation.areas = fields.get('location', [])
            pending_pdf_allegation.save()
