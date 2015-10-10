package com.shulianxunying.graduate;

import com.shulianxunying.graduate.lucene.entity.Graduate;
import com.shulianxunying.graduate.utils.JsonUtils;
import org.apache.lucene.document.Document;

import java.io.*;

/**
 * Created by chrislee on 15-10-9 下午3:28.
 */
public class OfflineIndex {
    public static void main(String[] args) throws IOException {
        String json_file_dir = "E:\\workspaces\\GraduateCareerPlanning\\PY_Graduate\\data\\";
        String json_file_name = "data.json";

        BufferedReader reader = new BufferedReader(new FileReader(new File(json_file_dir+json_file_name)));
        String line = "";
        while((line=reader.readLine()) != null){
            System.out.print(line);
            Graduate graduate = JsonUtils.toEntity(line, Graduate.class);
            Document document = graduate.toDoc();



        }




    }
}
