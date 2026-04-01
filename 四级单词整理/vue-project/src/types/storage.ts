// src/types/storage.ts

// 定义存储类型
export type StorageType = 'IndexedDB' | 'WebStorage' | 'Cookie' | 'Memory';

// 存储适配器接口
export interface StorageAdapter {
    type: StorageType;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}

// 页面打卡记录（艾宾浩斯曲线用）
export interface PageCheckInRecord {
    pageNum: number;
    date: string;        // YYYY-MM-DD 格式
    timestamp: number;   // 时间戳，用于精确计算
}

// 单词打卡记录（如果以后需要单词级打卡可以保留，当前未使用）
export interface CheckInRecord {
    pageNum: number;
    word: string;
    date: string;
    timestamp: number;
}
export interface WordBookEntry {
    word: string;        // 单词
    phonetic: string;    // 音标
    translation: string; // 汉译
    addedAt: string;     // ISO日期，记录添加时间
}

// 统一存储数据结构
export interface StorageSchema {
    meta: {
        version: number;
        lastUpdated: string;
        storageType: StorageType;
    };

    difficultWords: string[];
    wordInputs: Record<string, string>;

    // 页面级打卡记录（艾宾浩斯曲线）
    pageCheckIns: Record<string, PageCheckInRecord[]>; // key是页码字符串（避免number key的ts问题）
    wordBook: WordBookEntry[];

    // 主题设置
    settings: {
        theme: 'dark' | 'light';
        inputsVisible: boolean;
    };

    // 混合考察配置缓存
    mixedExamConfig?: {
        selectedPages: number[];
        count: number;
    };

}