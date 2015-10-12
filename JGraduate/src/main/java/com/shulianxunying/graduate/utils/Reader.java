package com.shulianxunying.graduate.utils;

import java.io.*;
import java.util.Properties;

/**
 * Created by AbnerLee on 15-1-20.
 */
public class Reader {
    public final static String UTF8 = "utf-8";
    public final static String GB2312 = "GB2312";

    public static InputStream getResourcesInputStream(String resource) {
        return Reader.class.getResourceAsStream(resource);
    }

    public static Properties readProperties(String property, String encoding) {
        Properties p = new Properties();
        try {
            p.load(new InputStreamReader(getResourcesInputStream(property), encoding));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return p;
    }

    public static BufferedReader getReader(String resource, String encoding) throws UnsupportedEncodingException {
        return new BufferedReader(new InputStreamReader(getResourcesInputStream(resource), encoding));
    }



}
