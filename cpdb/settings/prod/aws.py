import dj_database_url

from cpdb.settings.base import *


DEBUG = os.environ.get('DEBUG') == 'True'

DATABASES = {
    'default': {
        'ENGINE': os.environ['RDS_DB_ENGINE'],
        'NAME': os.environ['RDS_DB_NAME'],
        'USER': os.environ['RDS_USERNAME'],
        'PASSWORD': os.environ['RDS_PASSWORD'],
        'HOST': os.environ['RDS_HOSTNAME'],
        'PORT': os.environ['RDS_PORT'],
    }
}

ALLOWED_HOSTS = ['*']

ADMINS = (('Bang', 'daotranbang@gmail.com'), )

EMAIL_HOST = os.environ.get('POSTMARK_SMTP_SERVER')
EMAIL_HOST_PASSWORD = os.environ.get('POSTMARK_API_KEY')
EMAIL_HOST_USER = os.environ.get('POSTMARK_API_KEY')
EMAIL_PORT = 587

BROKER_URL = os.environ.get('REDISTOGO_URL')
