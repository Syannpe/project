/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

// src/models/ChartTable.ts
import Task from "./Task";

export default class ChartTable {
    private static instance: ChartTable;
    public tasks: Task[] = [];
    public startTime: Date = new Date();
    public endTime: Date = new Date();
    public duration: number = 0;

    /*
    * @name:
    * @params:
    * @return:
    * @desc: 通过基准时间计算当前相对时间对应的绝对时间，并返回
    * */
    public calcRelativeTime(relativeTime: number | Date, baseDate: Date): Date {
        if (typeof relativeTime === 'number')
            return new Date(baseDate.getTime() + relativeTime * 24 * 60 * 60 * 1000);
        return relativeTime;
    }

    /** 私有化构造，保持单例 */
    private constructor() {
    }

    /** 获取单例 */
    public static getInstance(): ChartTable {
        if (!ChartTable.instance) {
            ChartTable.instance = new ChartTable();
        }
        return ChartTable.instance;
    }

    public add(task: Task): void {
        this.tasks.push(task);
        this.refreshParams();
    }

    public remove(index: number): Task | undefined {
        const res = this.tasks.splice(index, 1)[0];
        this.refreshParams();
        return res;
    }

    public get(index: number): Task | undefined {
        return this.tasks[index];
    }

    /** 根据 tasks、baseDate 等重新计算参数 */
    public refreshParams(): void {
        console.log("刷新表格参数", this.tasks);
        // TODO: 重新计算 startTime/endTime/duration 等
        if (this.tasks.length === 0) {
            console.warn("ChartTable: no tasks to calculate parameters.");
            return;
        }

        // 1. 收集所有时间戳
        const startTimes = this.tasks.map(t => t.earlyStart.getTime());
        const endTimes = this.tasks.map(t => this.calcRelativeTime(t.lateEnd, t.lateStart).getTime());

        // 2. 计算最小／最大时间
        const minStartMs = Math.min(...startTimes);
        const maxEndMs = Math.max(...endTimes);

        // 3. 更新属性
        this.startTime = new Date(minStartMs);
        this.endTime = new Date(maxEndMs);

        // 4. 计算总跨度（毫秒 ➔ 天）
        const spanMs = maxEndMs - minStartMs;
        this.duration = spanMs / (1000 * 60 * 60 * 24);

    }
}