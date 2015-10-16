import random
import time

from common.constants import DATE_ONLY_FORMAT


def generate_random_date(start, end):
    stime = time.mktime(time.strptime(start, DATE_ONLY_FORMAT))
    etime = time.mktime(time.strptime(end, DATE_ONLY_FORMAT))

    ptime = stime + random.random() * (etime - stime)

    return time.strftime(DATE_ONLY_FORMAT, time.localtime(ptime))