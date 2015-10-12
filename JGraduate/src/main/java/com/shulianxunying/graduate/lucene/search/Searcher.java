package com.shulianxunying.graduate.lucene.search;

import com.shulianxunying.graduate.lucene.manager.LuceneConstant;
import org.apache.lucene.document.Document;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;

import java.io.IOException;
import java.util.*;

/**
 * Created by chrislee on 15-10-10 下午2:23.
 */
public class Searcher {

    public static Map<String, Object> pieChart(String college, String major, String expJob, int sample, int top, int routeCount) throws ParseException, IOException {
        IndexSearcher searcher = LuceneConstant.index.getSearcher();
        /**
         * 构造query
         */
        BooleanQuery query = new BooleanQuery();
        if (college != null && !"".equals(college.trim())){
            query.add(new QueryParser("college", LuceneConstant.ANALYZER).parse(college.trim()), BooleanClause.Occur.SHOULD);
        }
        if (major != null && !"".equals(major.trim())){
            query.add(new QueryParser("major", LuceneConstant.ANALYZER).parse(major.trim()), BooleanClause.Occur.MUST);
        }
        if (expJob != null && !"".equals(expJob.trim())){
            Query temp = new QueryParser("first_work", LuceneConstant.ANALYZER).parse(expJob.trim());
            temp.setBoost(2);
            query.add(temp, BooleanClause.Occur.SHOULD);
        }
        /**
         * 搜索
         */
        TopDocs hits = searcher.search(query, sample);
        /**
         * 统计
         */
        Map<String, Integer> jobs = new HashMap<>();
        List<String> route = new LinkedList<>();

        int bar = 0;
        for (ScoreDoc sd : hits.scoreDocs) {
            bar++;
            Document doc = searcher.doc(sd.doc);
            String foo = doc.get("first_work");
            if (foo.endsWith("部") || "实习生".equals(foo)){
                continue;
            }
            if (jobs.containsKey(foo)) {
                jobs.put(foo, jobs.get(foo) + 1);
            } else {
                jobs.put(foo, 1);
            }
            if (Integer.parseInt(doc.get("work_count")) > 1 && route.size() < routeCount){
                route.add(doc.get("work")+"="+bar);
            }
        }
        /**
         * 排序
         */
        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(jobs.entrySet());
        Collections.sort(entryList, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                return o2.getValue() - o1.getValue();
            }
        });
        entryList = entryList.subList(0, Math.min(entryList.size(), top));

        Map<String, Object> ret = new HashMap<>();
        ret.put("jobs", entryList);
        ret.put("route", route);
        return ret;
    }



    /**
     * 测试搜索
     */
    public static void main(String[] args) throws ParseException, IOException {
        IndexSearcher searcher = LuceneConstant.index.getSearcher();
        /**
         * 构造query
         */
        String q_college = "1123";
        String q_major = "电影学";
        String q_fWork = "123";
        BooleanQuery query = new BooleanQuery();

        query.add(new QueryParser("college", LuceneConstant.ANALYZER).parse(q_college), BooleanClause.Occur.SHOULD);
        query.add(new QueryParser("major", LuceneConstant.ANALYZER).parse(q_major), BooleanClause.Occur.MUST);

        Query q = new QueryParser("first_work", LuceneConstant.ANALYZER).parse(q_fWork);
        q.setBoost(2);

        query.add(q, BooleanClause.Occur.SHOULD);



        int max = 1000;
        TopDocs hits = searcher.search(query, max);


        Map<String, Integer> industres = new HashMap<>();
        List<String> route = new LinkedList<>();

        int bar = 0;
        for (ScoreDoc sd : hits.scoreDocs) {
            bar++;
            Document doc = searcher.doc(sd.doc);
            String foo = doc.get("first_work");
            if (foo.endsWith("部") || "实习生".equals(foo)){
                continue;
            }
//            for(String foo: industry.split(",")){
                if (industres.containsKey(foo)) {
                    industres.put(foo, industres.get(foo) + 1);
                } else {
                    industres.put(foo, 1);
                }
//            }
            if (Integer.parseInt(doc.get("work_count")) > 1 && route.size() < 5){
                route.add(doc.get("work")+"="+bar);
            }

        }
        System.out.println(hits.totalHits);
        System.out.println(hits.scoreDocs.length);
        System.out.println(industres.size());


        /**
         * 排序
         */
        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(industres.entrySet());
        Collections.sort(entryList, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                return o2.getValue() - o1.getValue();
            }
        });

        int foo = 0;
        float total = 0;
        List<Map.Entry<String, Integer>> ret = new ArrayList<>();

        for (Map.Entry<String, Integer> entry: entryList){
            foo++;
            total += entry.getValue();
            ret.add(entry);
            if (foo==6){
                break;
            }
        }

        for (Map.Entry<String, Integer> entry: ret){
            System.out.println(entry.getKey() + ": " + entry.getValue() + "/" + total + "  " + entry.getValue()/total);
        }

        for (String w: route){
            System.out.println(w);
        }




    }
}
