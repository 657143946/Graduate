package com.shulianxunying.graduate;

import com.shulianxunying.graduate.lucene.entity.Graduate;
import com.shulianxunying.graduate.lucene.manager.LuceneConstant;
import com.shulianxunying.graduate.utils.JsonUtils;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.IndexWriter;

import java.io.*;

/**
 * Created by chrislee on 15-10-9 下午3:28.
 */
public class OfflineIndex {
    public static void main(String[] args) throws IOException {
        String json_file_dir = "E:\\workspaces\\GraduateCareerPlanning\\PY_Graduate\\data\\";
        String json_file_name = "data.json";

        BufferedReader reader = new BufferedReader(new FileReader(new File(json_file_dir+json_file_name)));


        IndexWriter writer = LuceneConstant.index.getWriter();

        int count = 0;
        String line = "";
        while((line=reader.readLine()) != null){
            count++;
            if (count % 10000 == 0){
                System.out.println(count/10000 + "W");
            }
            Graduate graduate = JsonUtils.toEntity(line, Graduate.class);
            Document document = graduate.toDoc();
            writer.addDocument(document);
        }

        System.out.println("commit");
        writer.commit();

    }
}
