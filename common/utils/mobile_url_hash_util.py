from hashids import Hashids

from common.constants import MOBILE_SALT


class MobileUrlHashUtil(object):
    def __init__(self):
        self.instance = Hashids(MOBILE_SALT, min_length=8)

    def encode(self, str):
        return self.instance.encode(str)

    def decode(self, str):
        return self.instance.decode(str)[0]
