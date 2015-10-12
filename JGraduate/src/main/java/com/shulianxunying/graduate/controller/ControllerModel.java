package com.shulianxunying.graduate.controller;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ChrisLee on 15-5-24.
 * 控制器层返回前端json的统一格式
 */
public class ControllerModel {
    private boolean flag = true;
    private String msg = "SUCCESS";
    private Map<String, Object> data = new HashMap<>();

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Map<String, Object> getData() {
        return this.data;
    }

    public void put(String key, Object value){
        data.put(key, value);
    }

    public ControllerModel(boolean flag, String msg) {
        this.flag = flag;
        this.msg = msg;
    }

    public ControllerModel() {
        this(true, "SUCCESS");
    }
}
