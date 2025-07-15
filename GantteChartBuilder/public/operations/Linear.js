/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Command from "./Command.js";
import { HTMLInterface } from "../interfaces/HTMLInterface.js";
import ChartTable from "../models/ChartTable.js";
export default class Linear extends Command {
    tasks;
    constructor(tasks) {
        super(tasks);
        this.tasks = tasks;
    }
    /** 按线性顺序渲染所有任务 */
    render() {
        // console.log("Linear render", this.task);
        // TODO: 把 this.tasks 依次画到页面
        const html = HTMLInterface.getInstance();
        const tasks = this.tasks instanceof Array ? this.tasks : [this.tasks];
        //从所有任务中计算出最早开始的任务时间和最晚结束的任务时间
        let earlyStart = tasks.reduce((earlyStart, task) => earlyStart < task.earlyStart ? earlyStart : task.earlyStart, tasks[0].earlyStart);
        let lateStart = tasks.reduce((lateStart, task) => lateStart < task.lateStart ? lateStart : task.lateStart, tasks[0].lateStart);
        let earlyEnd = tasks.reduce((earlyEnd, task) => earlyEnd > ChartTable.getInstance().calcRelativeTime(task.earlyEnd, task.earlyStart) ?
            earlyEnd :
            ChartTable.getInstance().calcRelativeTime(task.earlyEnd, task.earlyStart), ChartTable.getInstance().calcRelativeTime(tasks[0].earlyEnd, tasks[0].earlyStart));
        let lateEnd = tasks.reduce((lateEnd, task) => lateEnd > ChartTable.getInstance().calcRelativeTime(task.lateEnd, task.earlyStart) ?
            lateEnd :
            ChartTable.getInstance().calcRelativeTime(task.lateEnd, task.earlyStart), ChartTable.getInstance().calcRelativeTime(tasks[0].lateEnd, tasks[0].earlyStart));
        const row = html.drawRow(tasks[0].id, tasks[0].name, earlyStart, lateStart, earlyEnd, lateEnd, tasks[0].color, tasks[0].equation);
        tasks.forEach(task => {
            const options = super.render();
            html.drawDate(row, task.earlyStart, task.lateStart, ChartTable.getInstance().calcRelativeTime(task.earlyEnd, task.earlyStart), ChartTable.getInstance().calcRelativeTime(task.lateEnd, task.earlyStart), task.proportion, options);
        });
        return null;
    }
}
//# sourceMappingURL=Linear.js.map