package com.shulianxunying.graduate.controller;

import com.shulianxunying.graduate.lucene.search.Searcher;
import org.apache.lucene.queryparser.classic.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.Map;

/**
 * Created by chrislee on 15-10-12 上午11:10.
 */
@Controller
@RequestMapping("/graduate")
public class Graduate {
    @ResponseBody
    @RequestMapping("pieChart.json")
    public ControllerModel pieChart(
            @RequestParam(defaultValue = "1984612") String college,
            @RequestParam(required = true) String major,
            @RequestParam(defaultValue = "1984612") String expJob
    ) throws IOException, ParseException {
        ControllerModel model = new ControllerModel();
        Map<String, Object> data = Searcher.pieChart(college, major, expJob, 1000, 6, 5);
        model.put("jobs", data.get("jobs"));
        model.put("route", data.get("route"));
        return model;
    }

    @RequestMapping("pieChart.page")
    public ModelAndView pieChartPage() {
        ModelAndView mv = new ModelAndView("/index.html");
        return mv;
    }
}
