package com.shulianxunying.graduate.lucene.entity;

import org.apache.lucene.document.Document;

/**
 * Created by chrislee on 15-10-9 下午3:56.
 */
public interface BaseEntity {
    Document toDoc();
}
