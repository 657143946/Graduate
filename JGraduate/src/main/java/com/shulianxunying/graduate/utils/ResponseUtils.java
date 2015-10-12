package com.shulianxunying.graduate.utils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by ChrisLee on 15-5-24.
 * Response 自定义工具类
 */
public class ResponseUtils {
    /**
     * response中写入json数据
     */
    public static void jsonReturn(HttpServletResponse response, String json) {
        /**
         * 设置Response的编码方式为UTF-8
         */
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-type", "application/json;charset=UTF-8");
        /**
         * 写json
         */
        try {
            response.getWriter().write(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * response中写入json数据
     */
    public static void jsonReturn(HttpServletResponse response, Object model) {
        String json = JsonUtils.toJson(model);
        jsonReturn(response, json);
    }

    /**
     * response重定向
     */
    public static void redirectPage(HttpServletResponse response, String redirect) {
        try {
            response.sendRedirect(redirect);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
