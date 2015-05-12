import dj_database_url

from cpdb.settings.base import *


DEBUG = os.environ.get('DEBUG') == 'True'

DATABASES['default'] = dj_database_url.config()

ALLOWED_HOSTS = ['*']

ADMINS = (('Bang', 'daotranbang@gmail.com'), ('Giang', 'giang271291@gmail.com'))

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

EMAIL_HOST = os.environ.get('POSTMARK_SMTP_SERVER')
EMAIL_HOST_PASSWORD = os.environ.get('POSTMARK_API_TOKEN')
EMAIL_HOST_USER = os.environ.get('POSTMARK_API_KEY')
EMAIL_PORT = 587
