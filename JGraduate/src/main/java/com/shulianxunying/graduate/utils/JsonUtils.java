package com.shulianxunying.graduate.utils;

import com.alibaba.fastjson.JSON;

/**
 * Created by chrislee on 15-10-9 下午3:31.
 */
public class JsonUtils {
    public static <T> T toEntity(String json, Class<T> clazz){
        return JSON.parseObject(json, clazz);
    }
}
