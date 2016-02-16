from cpdb.settings.base import *  # NOQA


ADMINS = (('Hieu', 'hieu.hoang@eastagile.com'), ('Giang', 'giang.nguyen@eastagile.com'),
          ('Khoi', 'khoi.pham@eastagile.com'), ('Huy', 'huy.nguyen@eastagile.com'),
          ('Tay', 'tay.nguyen@eastagile.com'), ('Stefan', 'stefan.georg@eastagile.com'),
          ('Thai', 'thai.nguyen@eastagile.com'))

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'django-errors.log'
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
