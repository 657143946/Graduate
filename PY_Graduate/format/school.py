# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os

cwp = os.path.dirname(os.path.abspath(__file__))

import sys

import pymongo

from spider.baike import baike


def make_college():
    """爬去百度百科的高校信息（列表）
    """
    host = "localhost"
    port = 27017
    db = "resume"
    table = "college"

    client = pymongo.MongoClient(host, port)
    page = 1
    while True:
        docs = baike.Baike.college(page)
        if docs:
            page += 1
            client[db][table].insert(docs)
        else:
            break


def make_format_school_name():
    """规整话教育背景中的学校
    仅仅限于百度百科给出的高校词条

    遍历简历（有工作经历，有教育经历）
        遍历edus
            学校名称是否直接在词条中
            是：continue
            否：
                查百度百科
                遍历前10条：
                    当名称是高校名称的时候
                        学校名称改成这个高校名称
                        break

    """
    host = "localhost"
    port = 27017
    db = "resume"
    table = "resume"
    skip = 0
    limit = sys.maxint
    # limit = 10

    out_table = "school_name_map"

    client = pymongo.MongoClient(host, port)
    count = skip
    for resume in client[db][table].find(timeout=False).skip(skip).limit(limit):
        count += 1
        if count % 100 == 0:
            print count
        if resume.get("educationList"):
            for edu in resume.get("educationList"):
                if edu.get("college_name"):
                    word = edu.get("college_name")
                    if client[db][out_table].find_one({"key": word}):
                        pass
                    else:
                        try:
                            items = baike.Baike.search(word)
                            if items:
                                for item in items:
                                    if client["resume"]["college"].find_one({"lemmaTitle": item['title']}):
                                        client[db][out_table].insert({"key": word, "value": item['title']})
                                        break
                        except Exception, e:
                            continue
    client.close()


def formatCollege(college, college_map={}, std_college=set()):
    ret = college_map.get(college, "")
    if ret:
        return ret
    else:
        items = baike.Baike.search(college)
        for item in items[0:5]:
            if item['title'] in std_college:
                college_map.put(college, item['title'])
                return item['title']
        return ""


# make_college()
make_format_school_name()
