#!/usr/bin/env python
import sys
from hashids import Hashids

hashobj = Hashids('8qTCKQzt5jYYTADWcUO8', min_length=8)
print(hashobj.encode(int(sys.argv[1])))
