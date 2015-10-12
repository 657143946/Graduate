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
    /**
     * 测试搜索
     */
    public static void main(String[] args) throws ParseException, IOException {
        IndexSearcher searcher = LuceneConstant.index.getSearcher();
        /**
         * 构造query
         */
        String q_college = "1123";
        String q_major = "计算机";
        String q_fWork = "产品";
        BooleanQuery query = new BooleanQuery();

        query.add(new QueryParser("college", LuceneConstant.ANALYZER).parse(q_college), BooleanClause.Occur.SHOULD);
        query.add(new QueryParser("major", LuceneConstant.ANALYZER).parse(q_major), BooleanClause.Occur.MUST);

        Query q = new QueryParser("first_work", LuceneConstant.ANALYZER).parse(q_fWork);
        q.setBoost(10);

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
        for (Map.Entry<String, Integer> entry: entryList){
            foo++;
            System.out.println(entry.getKey() + ": " + entry.getValue());
            if (foo==6){
                break;
            }
        }

        for (String w: route){
            System.out.println(w);
        }




    }
}
