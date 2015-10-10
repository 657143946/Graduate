# coding: utf-8
__author__ = 'Chris Lee'

import sys

reload(sys)
sys.setdefaultencoding("utf-8")

import os

cwp = os.path.dirname(os.path.abspath(__file__))

import pymongo
import json
import re
import datetime


def prepare_mongo_data():
    in_host = 'localhost'
    in_port = 27017
    in_db = 'resume'
    in_table = 'resume'

    out_host = 'localhost'
    out_port = 27017
    out_db = 'resume'
    out_table = 'graduate_v002'

    in_client = pymongo.MongoClient(in_host, in_port)
    out_client = pymongo.MongoClient(out_host, out_port)

    where = """
    function a(){
        try{
            return this.educationList[0] != undefined && this.workExperienceList[0] != undefined;
        }catch(err){
            return false;
        }
    }
    """
    year_pattern = re.compile(ur"\d{4}")
    count = 0
    for resume in in_client[in_db][in_table].find({"$where": where}, timeout=False):
        if count % 10000 == 0:
            print count
        count += 1

        if resume["educationList"][0]['profession_name'] and resume["educationList"][0]['college_name']:
            edu = {
                "college": resume["educationList"][0]['college_name'],
                "major": resume["educationList"][0]['profession_name'],
            }
        else:
            continue
        if resume['expect_industry']:
            industry = resume['expect_industry']
        else:
            continue
        works = []
        for work in resume['workExperienceList']:
            start = work['start_date']
            if start:
                start = year_pattern.findall(start)
                if start:
                    start = start[0]
                else:
                    continue
            else:
                continue
            start = int(start)
            end = work['end_date']
            if end:
                end = year_pattern.findall(end)
                if end:
                    end = end[0]
                else:
                    end = datetime.datetime.now().year
            else:
                end = datetime.datetime.now().year
            end = int(end)
            if start > end:
                continue
            else:
                if work["position_name"]:
                    works.append({
                        "position": work["position_name"],
                        "year": end - start
                    })
        if edu and works:
            out_client[out_db][out_table].insert({
                "education": edu,
                "work": works,
                "industry": industry,
            })


def prepare_json_data():
    in_host = 'localhost'
    in_port = 27017
    in_db = 'resume'
    in_table = 'graduate_v002'

    out_file = open(os.path.join(cwp, "data.json"), "w")

    in_client = pymongo.MongoClient(in_host, in_port)

    count = 0
    for foo in in_client[in_db][in_table].find(timeout=False):
        count += 1
        if count % 10000 == 0:
            print count/10000, 'W'
        out = {
            "first_work": foo["work"][-1]["position"],
            "college": foo["education"]["college"],
            "major": foo["education"]["major"],
            "industry": foo["industry"],
            "work": "@".join(["%s#%s" % (w["position"], w["year"]) for w in foo["work"][::-1]]),
            "work_count": len(foo["work"])
        }
        out_file.write(json.dumps(out))
        out_file.write("\n")


if __name__ == "__main__":
    # prepare_mongo_data()
    prepare_json_data()



