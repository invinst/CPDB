import random
import time
import datetime

from common.constants import DATE_ONLY_FORMAT


def tomorrow():
    return datetime.datetime.now() + datetime.timedelta(days=1)


def generate_random_date(start, end, format=DATE_ONLY_FORMAT):
    etime = time.mktime(time.strptime(end, format))
    stime = time.mktime(time.strptime(start, format))

    ptime = stime + random.random() * (etime - stime)

    return time.strftime(format, time.localtime(ptime))
