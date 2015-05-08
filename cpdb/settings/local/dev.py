import sys
from cpdb.settings.base import *


if 'test' in sys.argv:
    import sure
    (lambda n: n)(sure)  # ignore warning
    CELERY_ALWAYS_EAGER = True
