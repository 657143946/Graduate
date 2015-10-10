# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os

cwp = os.path.dirname(os.path.abspath(__file__))


import pymongo

from utils import utils
from spider.baike import baike




class College:
    """
    处理大学数据的相关类
    """
    def __init__(self):
        pass

    @staticmethod
    def format_college_name(college):
        """将大学名称统一化，统一成百度百科的高校百科
        """
        ret = COLLEGE_MAP.get(college, "")
        if ret:
            return ret
        else:
            items = baike.Baike.search(college)
            for item in items[0:5]:
                title = item["title"]
                if title in STD_COLLEGE:
                    College.college_map_file_write.write("%s=%s\n" % (college, title))
                    College.college_map_file_write.flush()
                    COLLEGE_MAP[college] = title
                    return title
            return ""

    @staticmethod
    def _load_std_college():
        return set(list(utils.read_file(College.std_college_file)))

    @staticmethod
    def _load_college_map():
        ret = {}
        for line in utils.read_file(College.college_map_file):
            key, value = line.split("=")
            assert value in STD_COLLEGE
            ret[key] = value
        return ret


    std_college_file = open(os.path.join(cwp, "std_college.txt"))
    college_map_file = open(os.path.join(cwp, "college_map.txt"))
    college_map_file_write = open(os.path.join(cwp, "college_map.txt"), "a")


STD_COLLEGE = College._load_std_college()
COLLEGE_MAP = College._load_college_map()
