package com.shulianxunying.graduate.controller;

import com.shulianxunying.graduate.lucene.search.Searcher;
import org.apache.lucene.queryparser.classic.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.enterprise.inject.Model;
import java.io.IOException;
import java.util.List;
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
        Map<String, Integer> jobs = Searcher.pieChart(college, major, expJob, 1000, 6);
        model.put("jobs", jobs);
        return model;
    }

    @RequestMapping("pieChart.page")
    public ModelAndView pieChartPage() {
        ModelAndView mv = new ModelAndView("/index.html");
        return mv;
    }

    @ResponseBody
    @RequestMapping("careerRoute.json")
    public ControllerModel careerRoute(
            @RequestParam(defaultValue = "1984612") String college,
            @RequestParam(defaultValue = "1984612") String major,
            @RequestParam(required = true) String expJob
    ) throws IOException, ParseException {
        ControllerModel model = new ControllerModel();
        List<List<String>> routes = Searcher.careerRoute(college, major, expJob, 2, 5, 100);
        try{
            routes = routes.subList(0, 10);
        } catch (Exception e){

        }
        model.put("routes", routes);
        return model;
    }
}
