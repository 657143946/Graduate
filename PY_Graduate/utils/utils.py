# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os

cwp = os.path.dirname(os.path.abspath(__file__))


def read_file(f):
    for line in f:
        line = line.decode("utf-8").strip()
        if line and not line.startswith("#"):
            yield line