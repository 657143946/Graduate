package com.shulianxunying.graduate.lucene.manager;

import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.store.Directory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by AbnerLee on 15-1-25.
 * IndexReader 生命周期管理
 */
public class ReaderManager {
    /**
     * DirectoryReader回收站
     */
    private static final Map<DirectoryReader, Long> recyleReaderMap = new HashMap<>();

    /**
     * Directory 和 DirectoryReader映射表
     */
    private static final Map<Directory, DirectoryReader> readerMap = new HashMap<>();

    /**
     * 最大周期
     */
    private static final int maxLifeTime = 60 * 1000;

    /**
     * 定时器
     */
    private static final Timer readerRefreshTimer = new Timer();

    /**
     * 单例
     */
    private static final ReaderManager manager = new ReaderManager();

    /**
     * 私有构造器
     */
    private ReaderManager() {
    }

    /**
     * 获取单例
     */
    public static synchronized ReaderManager getInstance() {
        return manager;
    }

    /**
     * 创建IndexReader并放在映射表中
     */
    public synchronized void createIndexReader(Directory dir) {
        try {
            DirectoryReader oldReader = readerMap.get(dir);
            if (oldReader != null) {  // 判断是否重复打开相同dir，导致旧的reader没有关闭
                oldReader.close();
            }
            readerMap.put(dir, DirectoryReader.open(dir));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取IndexReader
     */
    public IndexReader getIndexReader(Directory dir) {
        return readerMap.get(dir);
    }

    /**
     * 定时跟新IndexReader
     */
    static {
        readerRefreshTimer.schedule(new RefreshReaderTimerTask(), 60 * 1000 * 60 * 24 * 8000L);
    }


    private static class RefreshReaderTimerTask extends TimerTask {
        @Override
        public void run() {

            /**
             * 刷新reader
             */
            for (Entry<Directory, DirectoryReader> entry : readerMap.entrySet()) {
                try {
                    DirectoryReader oldReader = entry.getValue();
                    DirectoryReader newReader = DirectoryReader.openIfChanged(oldReader);

                    if (newReader != null) {
                        //替换旧reader对象
                        readerMap.put(entry.getKey(), newReader);
                        //放入回收MAP中
                        recyleReaderMap.put(oldReader, System.currentTimeMillis());
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            /**
             * 回收无用reader
             */
            for (Entry<DirectoryReader, Long> entry : new HashMap<DirectoryReader, Long>(recyleReaderMap).entrySet()) {
                if (System.currentTimeMillis() - entry.getValue() > maxLifeTime) {
                    try {
                        entry.getKey().close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        recyleReaderMap.remove(entry.getKey());
                    }
                }
            }
        }
    }


}
