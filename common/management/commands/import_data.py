import os
from django.core.management.base import BaseCommand
from django.db import connection
from cpdb.settings.base import BASE_DIR


class Command(BaseCommand):
    help = 'Import csv data'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        cursor = connection.cursor()
        dir_path = BASE_DIR + "/import_sql"
        files = os.listdir(dir_path)
        for file_name in files:
            with open(dir_path + "/" + file_name) as f:
                content = f.readlines()
                content = "".join(content)
                cursor.execute(content)
