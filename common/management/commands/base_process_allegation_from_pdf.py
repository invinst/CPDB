import os
import re
from datetime import datetime
from PyPDF2 import PdfFileReader

from django.core.management.base import BaseCommand

from common.models import Area, AllegationCategory


class ProcessAllegationFromPdfBaseCommand(BaseCommand):
    ALLEGATION_SEPARATOR_PATTERN = re.compile('|'.join([re.escape(s) for s in [
        'Log No. / C.R. ', 'Log/C.R. ', 'Log/ C.R. ', 'LOG/C.R. ',
        'LOG/C.R ', 'Log/CR ']]))
    CONTENT_PATTERN = r'((No|NO)\. ?)?(?P<crid>\d+) (?P<content>.*)'
    FIELDS_PATTERN = r'\s*Notification Date: (?P<notification_date>.+) Location: (?P<location>.+) Complaint: (?P<complaint>.+) Summary: (?P<summary>.+) Findings?: (?P<finding>.+)'
    FINDING_PATTERN = r'\"[^\"]+\"'

    def add_arguments(self, parser):
        parser.add_argument(
            'path', help='Please pass path to pdf files directory')

    def clean_text(self, text):
        result_text = re.sub(r'\uFB01|\uFB02', '"', text)
        result_text = re.sub(r'\u2122', '\'', result_text)
        result_text = re.sub(
            r'Created by INDEPENDENT POLICE REVIEW AUTHORITY|Page \d+ of \d+|\n|Abstracts of Sustained Cases\s+[A-Z]+\s+\d+',
            '', result_text)
        result_text = re.sub(r'\s+', ' ', result_text)

        return result_text

    def extract_text(self, file_name):
        pages = []
        with open(file_name, 'rb') as f:
            input_file = PdfFileReader(f)

            for page in input_file.pages:
                extracted_text = self.clean_text(page.extractText())
                pages.append(extracted_text)

        return ''.join(pages)

    def extract_fields(self, crid, content):
        '''Parse text by 2015 format'''
        fields = {}
        matched = re.match(self.FIELDS_PATTERN, content)

        self.errors = []

        if matched:
            fields['notification_date'] = self.get_notification_date(
                matched.group('notification_date').strip())
            fields['location'] = self.get_location(
                matched.group('location').strip())
            fields['complaint'] = self.get_complaint(
                matched.group('complaint').strip())
            fields['summary'] = matched.group('summary')
            fields['finding'] = self.get_finding(matched.group('finding'))
        else:
            fields['summary'] = content
            if 'Location:' in content:
                self.errors.append('Error: Invalid 2015 format')

        fields['errors'] = '\n'.join(self.errors)

        return fields

    def get_notification_date(self, text):
        try:
            notification_date = datetime.strptime(text, '%B %d, %Y')
        except ValueError:
            self.errors.append(
                'Error: Invalid date {value}.'.format(value=text))
            notification_date = None

        return notification_date

    def get_location(self, text):
        try:
            matched = re.match(r'(?P<district>\w+) District', text)

            if matched:
                location_name = matched.group('district')
            else:
                location_name = text
            location = [Area.objects.get(name=location_name.upper())]
        except Area.DoesNotExist:
            self.errors.append(
                'Error: Area {location} not found.'.format(location=text))
            location = []

        return location

    def get_complaint(self, text):
        text = ' / '.join([s.strip() for s in text.split('/')])

        try:
            complaint = AllegationCategory.objects.get(
                allegation_name__contains=text)
        except AllegationCategory.DoesNotExist:
            self.errors.append(
                'Error: Cannot find matching category "{complaint}"'
                .format(complaint=text))
            complaint = None
        except AllegationCategory.MultipleObjectsReturned:
            categories = AllegationCategory.objects.filter(
                allegation_name__contains=text)\
                .values_list('allegation_name', flat=True)
            self.errors.append(
                'Error: Cannot define category "{complaint}": {categories}.'
                .format(complaint=text, categories=','.join(categories)))
            complaint = None

        return complaint

    def get_finding(self, text):
        findings = re.findall(self.FINDING_PATTERN, text)

        if len(findings) == 1:
            finding = findings[0]
        else:
            finding = None
            self.errors.append(
                'Error: Multiple finding values {findings}'
                .format(findings='.'.join(findings)))

        return finding

    def process_allegation(self, crid, content):
        print('Override this method to process allegation')

    def post_pdf_processing(self):
        pass

    def handle_pdf_file(self, file_name):
        print('Processing file {file_name}...'.format(file_name=file_name))

        file_text = self.extract_text(file_name=file_name)
        file_text_splitted = re.split(
            self.ALLEGATION_SEPARATOR_PATTERN, file_text)

        for text in file_text_splitted:
            matched = re.match(self.CONTENT_PATTERN, text)

            # Check if content contains CRID
            if matched:
                self.process_allegation(
                    matched.group('crid'), matched.group('content'))

    def handle(self, *args, **options):
        path = options['path']

        if not path or not os.path.exists(path):
            print('Please pass valid path to pdf file or pdf files directory')
            return

        if os.path.isfile(path):
            self.handle_pdf_file(path)
        else:
            for file_name in os.listdir(path):
                if file_name.endswith('.pdf'):
                    file_path = os.path.join(path, file_name)
                    self.handle_pdf_file(file_path)

        self.post_pdf_processing()
