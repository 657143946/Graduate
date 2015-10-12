package com.shulianxunying.graduate.interceptor;

import com.shulianxunying.graduate.controller.ControllerModel;
import com.shulianxunying.graduate.utils.ResponseUtils;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by ChrisLee on 15-5-9.
 * 全局出错处理
 */
public class GlobalExceptionHandler implements HandlerExceptionResolver {
    private static final ModelAndView NONE = new ModelAndView();

    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        ex.printStackTrace();
        if (request.getServletPath().endsWith(".json")) {
            /**
             * 返回数据
             */
            ControllerModel data = new ControllerModel(false, "服务器出错啦！");
            ResponseUtils.jsonReturn(response, data);
        } else if (request.getServletPath().endsWith(".page")) {
            /**
             * 重定向到错误页面
             */
            ResponseUtils.redirectPage(response, request.getContextPath() + "/error/404.page");
        }
        return NONE;
    }
}
