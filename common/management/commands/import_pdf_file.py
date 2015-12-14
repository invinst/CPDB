import os
import re
from PyPDF2 import PdfFileReader

from django.core.management.base import BaseCommand

from common.models import Allegation


class Command(BaseCommand):
    args = 'path'
    help = 'Please pass path to pdf files directory'

    CONTENT_SEPARATOR_PATTERN = re.compile('|'.join(map(re.escape, ['Log No. / C.R. ', 'Log/C.R. '])))
    CONTENT_PATTERN = r'No\. (?P<crid>\d+) (?P<content>.*)'

    def clean_text(self, text):
        result_text = re.sub(r'\uFB01|\uFB02', '"', text)
        result_text = re.sub(r'Created by INDEPENDENT POLICE REVIEW AUTHORITY|Page \d+ of \d+', '', result_text)
        result_text = re.sub(r'\s+', ' ', result_text)

        return result_text

    def extract_text(self, file):
        input_file = PdfFileReader(open(file, 'rb'))
        pages = []

        for page in input_file.pages:
            extracted_text = self.clean_text(page.extractText())
            pages.append(extracted_text)

        return ''.join(pages)

    def update_allegation(self, crid, content):
        if Allegation.objects.filter(crid=crid).exists():
            Allegation.objects.filter(crid=crid).update(description=content)
        else:
            Allegation(crid=crid, description=content).save()

    def handle_pdf_file(self, file):
        file_text = self.extract_text(file=file)
        file_text_splitted = re.split(self.CONTENT_SEPARATOR_PATTERN, file_text)
        for text in file_text_splitted:
            matched = re.match(self.CONTENT_PATTERN, text)
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
