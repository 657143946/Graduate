package com.shulianxunying.graduate.lucene.manager;

import org.wltea.analyzer.lucene.IKAnalyzer;

/**
 * Created by chrislee on 15-10-9 下午4:09.
 */
public class LuceneConstant {
    public static final String INDEX_PATH = "E:\\workspaces\\GraduateCareerPlanning\\JGraduate\\index";
    public static final IndexManager index = new IndexManager(INDEX_PATH);

    public static final IKAnalyzer ANALYZER = new IKAnalyzer(true);
}
