// src/utils/StorageManager.ts

import type {
    StorageAdapter,
    StorageType,
    StorageSchema,
    PageCheckInRecord,
    CheckInRecord,
    WordBookEntry
} from '@/types/storage';

export class StorageManager {
    private static instance: StorageManager;
    private adapter: StorageAdapter | null = null;
    private storageType: StorageType = 'Memory';
    private memoryStore: Map<string, string> = new Map();
    private readonly DB_NAME = 'WordLearningDB';
    private readonly STORE_NAME = 'wordData';
    private readonly DB_VERSION = 1;
    private db: IDBDatabase | null = null;

    // 单例模式
    public static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    // 初始化并测试存储能力（自动降级）
    public async init(): Promise<StorageType> {
        // 尝试顺序：IndexedDB -> WebStorage -> Cookie -> Memory
        try {
            if (await this.testIndexedDB()) {
                this.storageType = 'IndexedDB';
                this.adapter = this.createIndexedDBAdapter();
                return this.storageType;
            }
        } catch (e) {
            console.warn('IndexedDB 不可用:', e);
        }

        try {
            if (this.testWebStorage()) {
                this.storageType = 'WebStorage';
                this.adapter = this.createWebStorageAdapter();
                return this.storageType;
            }
        } catch (e) {
            console.warn('WebStorage 不可用:', e);
        }

        try {
            if (this.testCookie()) {
                this.storageType = 'Cookie';
                this.adapter = this.createCookieAdapter();
                return this.storageType;
            }
        } catch (e) {
            console.warn('Cookie 不可用:', e);
        }

        // 最终兜底：内存存储
        this.storageType = 'Memory';
        this.adapter = this.createMemoryAdapter();
        return this.storageType;
    }

    // 获取当前存储类型
    public getStorageType(): StorageType {
        return this.storageType;
    }

    // 基础存储操作
    public async get(key: string): Promise<string | null> {
        if (!this.adapter) await this.init();
        return this.adapter!.get(key);
    }

    public async set(key: string, value: string): Promise<boolean> {
        if (!this.adapter) await this.init();
        return this.adapter!.set(key, value);
    }

    public async remove(key: string): Promise<boolean> {
        if (!this.adapter) await this.init();
        return this.adapter!.remove(key);
    }

    // 高级操作：获取整个Schema
    public async getSchema(): Promise<StorageSchema> {
        const defaultSchema: StorageSchema = {
            meta: {
                version: 1,
                lastUpdated: new Date().toISOString(),
                storageType: this.storageType
            },
            difficultWords: [],
            wordInputs: {},
            pageCheckIns: {}, // 使用 pageCheckIns 替代 checkInRecords
            wordBook: [], // 新增
            settings: {
                theme: 'light',
                inputsVisible: true
            }
        };

        try {
            const data = await this.get('word_learning_schema');
            if (data) {
                const parsed = JSON.parse(data) as StorageSchema;
                // 合并默认值，确保结构完整性
                return { ...defaultSchema, ...parsed };
            }
        } catch (e) {
            console.error('解析存储数据失败:', e);
        }
        return defaultSchema;
    }

    // 保存整个Schema
    public async saveSchema(schema: Partial<StorageSchema>): Promise<boolean> {
        try {
            const current = await this.getSchema();
            const updated: StorageSchema = {
                ...current,
                ...schema,
                meta: {
                    ...current.meta,
                    ...schema.meta,
                    lastUpdated: new Date().toISOString(),
                    storageType: this.storageType
                }
            };
            return await this.set('word_learning_schema', JSON.stringify(updated));
        } catch (e) {
            console.error('保存数据失败:', e);
            return false;
        }
    }

    // 难单词操作
    public async addDifficultWord(word: string): Promise<boolean> {
        const schema = await this.getSchema();
        if (!schema.difficultWords.includes(word)) {
            schema.difficultWords.push(word);
            return await this.saveSchema({ difficultWords: schema.difficultWords });
        }
        return true;
    }

    public async removeDifficultWord(word: string): Promise<boolean> {
        const schema = await this.getSchema();
        schema.difficultWords = schema.difficultWords.filter(w => w !== word);
        return await this.saveSchema({ difficultWords: schema.difficultWords });
    }

    public async getDifficultWords(): Promise<string[]> {
        const schema = await this.getSchema();
        return schema.difficultWords;
    }

    public async isDifficult(word: string): Promise<boolean> {
        const words = await this.getDifficultWords();
        return words.includes(word);
    }

    // 单词输入操作（使用单词作为key，避免随机排序问题）
    public async saveWordInput(word: string, value: string): Promise<boolean> {
        const schema = await this.getSchema();
        schema.wordInputs[word] = value;
        return await this.saveSchema({ wordInputs: schema.wordInputs });
    }

    public async getWordInput(word: string): Promise<string> {
        const schema = await this.getSchema();
        return schema.wordInputs[word] || '';
    }

    // ==================== 页面级打卡功能（艾宾浩斯曲线） ====================

    /**
     * 页面打卡 - 记录当前页今日已打卡
     */
    public async checkInPage(pageNum: number): Promise<boolean> {
        const schema = await this.getSchema();
        const today = new Date().toISOString().split('T')[0];

        // 使用字符串key避免object key number的问题
        const key = String(pageNum);

        if (!schema.pageCheckIns[key]) {
            schema.pageCheckIns[key] = [];
        }

        // 检查今天是否已打卡（避免重复）
        const alreadyCheckedToday = schema.pageCheckIns[key].some(
            (record: PageCheckInRecord) => record.date === today
        );

        if (alreadyCheckedToday) {
            return false; // 今日已打卡
        }

        schema.pageCheckIns[key].push({
            pageNum,
            // @ts-ignore
            date: today,
            timestamp: Date.now()
        });

        return await this.saveSchema({ pageCheckIns: schema.pageCheckIns });
    }

    /**
     * 获取页面的打卡记录
     */
    public async getPageCheckIns(pageNum: number): Promise<PageCheckInRecord[]> {
        const schema = await this.getSchema();
        return schema.pageCheckIns[String(pageNum)] || [];
    }

    /**
     * 获取页面最后一次打卡信息
     */
    public async getLastCheckIn(pageNum: number): Promise<PageCheckInRecord | null> {
        const records = await this.getPageCheckIns(pageNum);
        if (records.length === 0) return null;
        // @ts-ignore
        return records[records.length - 1];
    }

    /**
     * 获取页面的复习状态（艾宾浩斯曲线）
     * 返回：距离今天的天数差，是否在复习节点上
     */
    public async getPageReviewStatus(pageNum: number): Promise<{
        daysSince: number;      // -1表示未打卡，0表示今天，1表示昨天，以此类推
        isDue: boolean;         // 是否需要复习
        dueNode: number | null; // 匹配的节点：1,2,5,10 或 null
        isNew: boolean;         // 是否从未打卡
    }> {
        const lastRecord = await this.getLastCheckIn(pageNum);

        if (!lastRecord) {
            return { daysSince: -1, isDue: false, dueNode: null, isNew: true };
        }

        const today = new Date();
        const lastDate = new Date(lastRecord.date);
        const diffTime = today.getTime() - lastDate.getTime();
        const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // 艾宾浩斯节点（容错±1天）
        const reviewNodes = [1, 2, 5, 10];
        let isDue = false;
        let dueNode: number | null = null;

        for (const node of reviewNodes) {
            if (Math.abs(daysSince - node) <= 1) {
                isDue = true;
                dueNode = node;
                break;
            }
        }

        // 如果超过10天，也算需要复习（但不再匹配特定节点）
        if (daysSince > 11 && !isDue) {
            isDue = true;
            dueNode = daysSince;
        }

        return { daysSince, isDue, dueNode, isNew: false };
    }

    /**
     * 获取所有需要复习的页面列表
     */
    public async getAllDuePages(): Promise<Array<{
        pageNum: number;
        daysSince: number;
        dueNode: number | null;
    }>> {
        const schema = await this.getSchema();
        const duePages: Array<{pageNum: number; daysSince: number; dueNode: number | null}> = [];

        // 遍历所有有记录的页面
        for (const pageNumStr of Object.keys(schema.pageCheckIns)) {
            const pageNum = parseInt(pageNumStr);
            const status = await this.getPageReviewStatus(pageNum);
            if (status.isDue) {
                duePages.push({
                    pageNum,
                    daysSince: status.daysSince,
                    dueNode: status.dueNode
                });
            }
        }

        return duePages.sort((a, b) => a.pageNum - b.pageNum);
    }

    // 主题设置
    public async getTheme(): Promise<'dark' | 'light'> {
        const schema = await this.getSchema();
        return schema.settings.theme;
    }

    public async setTheme(theme: 'dark' | 'light'): Promise<boolean> {
        const schema = await this.getSchema();
        schema.settings.theme = theme;
        return await this.saveSchema({ settings: schema.settings });
    }

    // ==================== 存储适配器私有方法 ====================

    private async testIndexedDB(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                const request = indexedDB.open('__test__', 1);
                request.onsuccess = () => {
                    request.result.close();
                    indexedDB.deleteDatabase('__test__');
                    resolve(true);
                };
                request.onerror = () => resolve(false);
            } catch (e) {
                resolve(false);
            }
        });
    }

    private createIndexedDBAdapter(): StorageAdapter {
        return {
            type: 'IndexedDB',
            get: async (key: string) => {
                const db = await this.getDB();
                return new Promise((resolve) => {
                    const tx = db.transaction(this.STORE_NAME, 'readonly');
                    const store = tx.objectStore(this.STORE_NAME);
                    const req = store.get(key);
                    req.onsuccess = () => resolve(req.result?.value || null);
                    req.onerror = () => resolve(null);
                });
            },
            set: async (key: string, value: string) => {
                const db = await this.getDB();
                return new Promise((resolve) => {
                    const tx = db.transaction(this.STORE_NAME, 'readwrite');
                    const store = tx.objectStore(this.STORE_NAME);
                    const req = store.put({ key, value, timestamp: Date.now() });
                    req.onsuccess = () => resolve(true);
                    req.onerror = () => resolve(false);
                });
            },
            remove: async (key: string) => {
                const db = await this.getDB();
                return new Promise((resolve) => {
                    const tx = db.transaction(this.STORE_NAME, 'readwrite');
                    const store = tx.objectStore(this.STORE_NAME);
                    const req = store.delete(key);
                    req.onsuccess = () => resolve(true);
                    req.onerror = () => resolve(false);
                });
            }
        };
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
                }
            };
        });
    }

    private testWebStorage(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    private createWebStorageAdapter(): StorageAdapter {
        return {
            type: 'WebStorage',
            get: async (key: string) => localStorage.getItem(key),
            set: async (key: string, value: string) => {
                try {
                    localStorage.setItem(key, value);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            remove: async (key: string) => {
                localStorage.removeItem(key);
                return true;
            }
        };
    }

    private testCookie(): boolean {
        try {
            const test = '__cookie_test__=1; path=/; SameSite=Strict';
            document.cookie = test;
            const hasCookie = document.cookie.includes('__cookie_test__');
            document.cookie = '__cookie_test__=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            return hasCookie;
        } catch (e) {
            return false;
        }
    }

    private createCookieAdapter(): StorageAdapter {
        return {
            type: 'Cookie',
            get: async (key: string) => {
                const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
                // @ts-ignore
                return match ? decodeURIComponent(match[2]) : null;
            },
            set: async (key: string, value: string) => {
                try {
                    if (value.length > 4000) {
                        console.warn('Cookie 存储溢出');
                        return false;
                    }
                    const expires = new Date();
                    expires.setFullYear(expires.getFullYear() + 1);
                    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
                    return true;
                } catch (e) {
                    return false;
                }
            },
            remove: async (key: string) => {
                document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                return true;
            }
        };
    }

    private createMemoryAdapter(): StorageAdapter {
        return {
            type: 'Memory',
            get: async (key: string) => this.memoryStore.get(key) || null,
            set: async (key: string, value: string) => {
                this.memoryStore.set(key, value);
                return true;
            },
            remove: async (key: string) => {
                this.memoryStore.delete(key);
                return true;
            }
        };
    }
    /**
     * 获取单词本所有条目
     */
    public async getWordBook(): Promise<WordBookEntry[]> {
        const schema = await this.getSchema();
        return schema.wordBook || [];
    }

    /**
     * 添加单词到单词本
     * 返回：{ success: boolean, exists: boolean, existingWord?: any }
     */
    public async addToWordBook(entry: Omit<WordBookEntry, 'addedAt'>): Promise<{
        success: boolean;
        exists: boolean;
        existingWord?: WordBookEntry;
        message: string;
    }> {
        const schema = await this.getSchema();

        // 检查是否已存在于单词本中
        const existingInBook = schema.wordBook.find(w => w.word.toLowerCase() === entry.word.toLowerCase());
        if (existingInBook) {
            return {
                success: false,
                exists: true,
                existingWord: existingInBook,
                message: `单词 "${entry.word}" 已在单词本中存在`
            };
        }

        // 添加到单词本
        const newEntry: WordBookEntry = {
            ...entry,
            addedAt: new Date().toISOString()
        };

        schema.wordBook.push(newEntry);
        const saved = await this.saveSchema({ wordBook: schema.wordBook });

        return {
            success: saved,
            exists: false,
            message: saved ? `成功添加 "${entry.word}" 到单词本` : '保存失败，请重试'
        };
    }

    /**
     * 从单词本删除单词
     */
    public async removeFromWordBook(word: string): Promise<boolean> {
        const schema = await this.getSchema();
        const initialLength = schema.wordBook.length;
        schema.wordBook = schema.wordBook.filter(w => w.word.toLowerCase() !== word.toLowerCase());

        if (schema.wordBook.length !== initialLength) {
            return await this.saveSchema({ wordBook: schema.wordBook });
        }
        return true;
    }

    /**
     * 更新单词本中的单词
     */
    public async updateWordBookEntry(word: string, updates: Partial<Omit<WordBookEntry, 'word' | 'addedAt'>>): Promise<boolean> {
        const schema = await this.getSchema();
        const index = schema.wordBook.findIndex(w => w.word.toLowerCase() === word.toLowerCase());

        if (index === -1) return false;

        schema.wordBook[index] = {
            ...schema.wordBook[index],
            ...updates
        } as WordBookEntry;

        return await this.saveSchema({ wordBook: schema.wordBook });
    }

    /**
     * 检查单词是否存在于系统（原始词库或单词本）
     * 返回：{ inSystem: boolean, inWordBook: boolean, data?: any }
     */
    public async checkWordExists(word: string): Promise<{
        inSystem: boolean;
        inWordBook: boolean;
        data?: WordBookEntry | { word: string; phonetic: string; 汉译: string; 考察次数?: number };
        message: string;
    }> {
        // 检查原始四级单词库（sortedData）
        // 注意：这里需要在组件中传入sortedData进行检查，或者我们在组件层处理
        // StorageManager 只检查单词本

        const schema = await this.getSchema();
        const inWordBook = schema.wordBook.find(w => w.word.toLowerCase() === word.toLowerCase());

        if (inWordBook) {
            return {
                inSystem: true,
                inWordBook: true,
                data: inWordBook,
                message: `单词 "${word}" 已在单词本中`
            };
        }

        return {
            inSystem: false,
            inWordBook: false,
            message: `单词 "${word}" 可以添加`
        };
    }

    /**
     * 导出单词本为JSON
     */
    public async exportWordBook(): Promise<{
        json: string;
        count: number;
        filename: string;
    }> {
        const wordBook = await this.getWordBook();
        const exportData = {
            exportDate: new Date().toISOString(),
            totalCount: wordBook.length,
            words: wordBook.map(entry => ({
                单词: entry.word,
                音标: entry.phonetic,
                汉译: entry.translation,
                添加日期: entry.addedAt.split('T')[0]
            }))
        };

        return {
            json: JSON.stringify(exportData, null, 2),
            count: wordBook.length,
            filename: `word-book-${new Date().toISOString().slice(0, 10)}.json`
        };
    }
}

// 导出单例
export const storageManager = StorageManager.getInstance();