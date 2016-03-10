from cpdb.settings.base import *  # NOQA


ADMINS = (('Hieu', 'hieu.hoang@eastagile.com'), ('Giang', 'giang.nguyen@eastagile.com'),
          ('Khoi', 'khoi.pham@eastagile.com'), ('Huy', 'huy.nguyen@eastagile.com'),
          ('Tay', 'tay.nguyen@eastagile.com'), ('Stefan', 'stefan.georg@eastagile.com'),
          ('Thai', 'thai.nguyen@eastagile.com'))

# TODO: remove this when we have newrelic setup
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024*1024*5,
            'backupCount': 5,
            'filename': 'django_errors.log'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': False,
        }
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

TEMPLATES[0]['DIRS'] = ['templates']
TEMPLATES[0]['APP_DIRS'] = False
