import os
import re
from datetime import datetime
from PyPDF2 import PdfFileReader

from django.core.management.base import BaseCommand

from common.models import Allegation, Area, AllegationCategory, PendingPdfAllegation


class Command(BaseCommand):
    args = 'path'
    help = 'Please pass path to pdf files directory'

    CONTENT_SEPARATOR_PATTERN = re.compile('|'.join([re.escape(s) for s in ['Log No. / C.R. ', 'Log/C.R. ', 'Log/ C.R. ', 'LOG/C.R. ','LOG/C.R ', 'Log/CR ']]))
    CONTENT_PATTERN = r'((No|NO)\. ?)?(?P<crid>\d+) (?P<content>.*)'
    FIELDS_PATTERN = r'\s*Notification Date: (?P<notification_date>.+) Location: (?P<location>.+) Complaint: (?P<complaint>.+) Summary: (?P<summary>.+) Findings?: (?P<finding>.+)'
    FINDING_PATTERN = r'\"[^\"]+\"'

    def clean_text(self, text):
        result_text = re.sub(r'\uFB01|\uFB02', '"', text)
        result_text = re.sub(r'\u2122', '\'', result_text)
        result_text = re.sub(r'Created by INDEPENDENT POLICE REVIEW AUTHORITY|Page \d+ of \d+|\n|Abstracts of Sustained Cases\s+[A-Z]+\s+\d+', '', result_text)
        result_text = re.sub(r'\s+', ' ', result_text)

        return result_text

    def extract_text(self, file):
        input_file = PdfFileReader(open(file, 'rb'))
        pages = []

        for page in input_file.pages:
            extracted_text = self.clean_text(page.extractText())
            pages.append(extracted_text)

        return ''.join(pages)

    def extract_fields(self, crid, content):
        fields = {}
        matched = re.match(self.FIELDS_PATTERN, content)

        fields['errors'] = ''

        if matched:
            fields['notification_date'] = matched.group('notification_date').strip()
            fields['location'] = matched.group('location').strip()
            fields['complaint'] = matched.group('complaint').strip()
            fields['summary'] = matched.group('summary')
            fields['finding'] = matched.group('finding')

            # Handle notification date
            try:
                fields['notification_date'] = datetime.strptime(fields['notification_date'], '%B %d, %Y')
            except ValueError:
                fields['errors'] += 'Error:{crid}, Invalid date {value}.\n'.format(crid=crid, value=fields['notification_date'])
                fields['notification_date'] = None

            # Handle location
            try:
                matched_district = re.match(r'(?P<district>\w+) District', fields['location'])

                if matched_district:
                    fields['location'] = [Area.objects.get(name=matched_district.group('district').upper())]
                else:
                    fields['location'] = [Area.objects.get(name=fields['location'].upper())]
            except Area.DoesNotExist:
                fields['errors'] += 'Error:{crid}, Area {location} not found.\n'.format(crid=crid, location=fields['location'])
                fields['location'] = []

            # Handle complaint
            fields['complaint'] = ' / '.join([s.strip() for s in fields['complaint'].split('/')])
            if AllegationCategory.objects.filter(allegation_name__contains=fields['complaint']).count() == 1:
                fields['complaint'] = AllegationCategory.objects.get(allegation_name__contains=fields['complaint'])
            else:
                categories = AllegationCategory.objects.filter(allegation_name__contains=fields['complaint']).values_list('allegation_name', flat=True)
                fields['errors'] += 'Error:{crid}, Cannot define category "{complaint}": {categories}.\n'.format(
                    crid=crid,
                    complaint=fields['complaint'],
                    categories=','.join(categories)
                    )
                fields['complaint'] = None

            # Handle finding
            findings = re.findall(self.FINDING_PATTERN, fields['finding'])
            if len(findings) == 1:
                fields['finding'] = findings[0]
            else:
                fields['finding'] = None
                fields['errors'] += 'Error: Multiple finding values {findings}'.format(findings='.'.join(findings))
        else:
            if 'Location:' in content:
                fields['errors'] += 'Error: Not follow format\n'

        return fields

    def update_allegation(self, crid, content):
        fields = self.extract_fields(crid, content)

        if Allegation.objects.filter(crid=crid).exists():
            Allegation.objects.filter(crid=crid).update(description=content)
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

    def handle_pdf_file(self, file):
        file_text = self.extract_text(file=file)
        file_text_splitted = re.split(self.CONTENT_SEPARATOR_PATTERN, file_text)
        for text in file_text_splitted:
            matched = re.match(self.CONTENT_PATTERN, text)
            # Check if content contains CRID
            if matched:
                self.update_allegation(matched.group('crid'), matched.group('content'))

    def handle(self, *args, **options):
        if len(args) == 1:
            path = os.path.join(os.getcwd(), args[0])
        else:
            path = None

        if not path or not os.path.exists(path):
            print('Please pass path to pdf files directory')
            return

        for file in os.listdir(path):
            if file.endswith('.pdf'):
                print('Processing file {file}...'.format(file=file))

                absolute_file_path = os.path.join(path, file)
                self.handle_pdf_file(absolute_file_path)
