/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
export default class ChartTable {
    static instance;
    tasks = [];
    startTime = new Date();
    endTime = new Date();
    duration = 0;
    /*
    * @name:
    * @params:
    * @return:
    * @desc: 通过基准时间计算当前相对时间对应的绝对时间，并返回
    * */
    calcRelativeTime(relativeTime, baseDate) {
        if (typeof relativeTime === 'number')
            return new Date(baseDate.getTime() + relativeTime * 24 * 60 * 60 * 1000);
        return relativeTime;
    }
    /** 私有化构造，保持单例 */
    constructor() {
    }
    /** 获取单例 */
    static getInstance() {
        if (!ChartTable.instance) {
            ChartTable.instance = new ChartTable();
        }
        return ChartTable.instance;
    }
    add(task) {
        this.tasks.push(task);
        this.refreshParams();
    }
    remove(index) {
        const res = this.tasks.splice(index, 1)[0];
        this.refreshParams();
        return res;
    }
    get(index) {
        return this.tasks[index];
    }
    /** 根据 tasks、baseDate 等重新计算参数 */
    refreshParams() {
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
//# sourceMappingURL=ChartTable.js.map