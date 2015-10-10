package com.shulianxunying.graduate.lucene.entity;

import org.apache.lucene.document.Document;

/**
 * Created by chrislee on 15-10-9 下午3:32.
 */
public class Graduate implements BaseEntity {
    private String college;
    private String major;
    private String first_work;
    private String industry;
    private String work;

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getFirst_work() {
        return first_work;
    }

    public void setFirst_work(String first_work) {
        this.first_work = first_work;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getWork() {
        return work;
    }

    public void setWork(String work) {
        this.work = work;
    }

    @Override
    public Document toDoc() {
        // TODO
        return null;
    }
}
