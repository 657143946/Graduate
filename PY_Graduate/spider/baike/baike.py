# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os

cwp = os.path.dirname(os.path.abspath(__file__))

import urllib2
import json

from bs4 import BeautifulSoup

from spider import public


class Baike:
    """
    针对百度百科的爬虫类
    """
    host = "http://baike.baidu.com"

    def __init__(self):
        pass

    @staticmethod
    def search(word, page=1):
        """调用百度百科的搜索，获取页面信息
        """
        url = Baike.host + "/search"
        get_data = {
            "word": word,
            "pn": (page - 1) * 10,
            "rn": 10,
            "enc": "utf8"
        }
        request = public.make_request(url, get_data=get_data)
        res = urllib2.urlopen(request, timeout=4)
        body = res.read()

        ret = []
        soup = BeautifulSoup(body, 'html.parser')
        for dd in soup.find_all("dd"):
            if dd and dd.a and dd.a.get_text() and dd.a.get_text().endswith(u"_百度百科"):
                item = {
                    "title": dd.a.get_text()[0:-5],
                    "url": dd.a["href"],
                    "desc": dd.p.get_text(),
                }
                ret.append(item)
        return ret

    @staticmethod
    def detail(url):
        #TODO
        body = urllib2.urlopen(public.make_request(url)).read()
        soup = BeautifulSoup(body, 'html.parser')
        for div in soup.find_all("div", attrs={"class": "baseBox"}):
            print div

    @staticmethod
    def checkCollege(url):
        """检查对应百科是不是百科高校
        """
        body = urllib2.urlopen(public.make_request(url)).read()
        soup = BeautifulSoup(body, 'html.parser')
        if soup.body["class"][-1] == "collegeSmall":
            return True
        else:
            return False

    @staticmethod
    def college(page=1):
        url = Baike.host + "/wikitag/api/getlemmas"
        post_data = {
            "limit":30,
            "timeout": 3000,
            "filterTags": [0, 0, 0, 0, 0, 0, 0],
            "tagId": 60829,
            "fromLemma": False,
            "contentLength": 40,
            "page": page-1
        }
        request = public.make_request(url, post_data=post_data)
        res = urllib2.urlopen(request)
        res = json.loads(res.read())
        return res["lemmaList"]
