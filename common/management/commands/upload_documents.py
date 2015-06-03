import glob
from django.core.management.base import BaseCommand
import os
from documentcloud import DocumentCloud
import shutil


class Command(BaseCommand):
    help = 'Upload complaint documents'

    doc_dir = 'requested_docs'
    uploaded_dir = 'uploaded'

    username = 'giang.nguyen@eastagile.com'
    secret = 'Try8nother#'

    def handle(self, *args, **options):


        filepath_pattern = os.path.join(self.doc_dir, '*.pdf')
        for filepath in glob.glob(filepath_pattern):
            client = DocumentCloud(self.username, self.secret)
            obj = client.documents.upload(filepath)

            if obj:
                upload_path = os.path.join(self.doc_dir, self.uploaded_dir)
                if not os.path.exists(upload_path):
                    os.makedirs(upload_path)

                filename = os.path.split(filepath)[1]
                dest_filepath = os.path.join(upload_path, filename)
                shutil.move(filepath, dest_filepath)
