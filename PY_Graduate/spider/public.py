# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os
cwp = os.path.dirname(os.path.abspath(__file__))

import urllib2
import urllib


def make_request(url, get_data={}, post_data={}):
    if not url.startswith("http://"):
        url = "http://" + url
    if not url.endswith("?"):
        url += "?"
    url += urllib.urlencode(get_data)
    return urllib2.Request(url, data=urllib.urlencode(post_data))