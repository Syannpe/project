/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

// src/operations/Loop.ts
import Task from "../models/Task.js";
import Command from "./Command.js";
import {HTMLInterface, TableCellStatus} from "../interfaces/HTMLInterface.js";
import ChartTable from "../models/ChartTable.js";
import DrawOptions from "../interfaces/DrawOptions";

export default class Loop extends Command {
    /** 用于判断某天是否渲染 */
    constructor(
        public tasks: Task | Task[]
    ) {
        super(tasks);
    }

    public render(): Object {
        // console.log("Loop render", this.task);
        // TODO: 遍历日期，调用 equation 决定是否渲染

        const html = HTMLInterface.getInstance();

        const tasks = this.tasks instanceof Array ? this.tasks : [this.tasks];
        tasks.forEach(task => {
            let earlyStart = task.earlyStart;
            let lateStart = task.lateStart;
            let earlyEnd = ChartTable.getInstance().calcRelativeTime(task.earlyEnd, task.earlyStart);
            let lateEnd = ChartTable.getInstance().calcRelativeTime(task.lateEnd, task.lateStart);

            const row = html.drawRow(task.id, task.name,
                earlyStart, lateStart,
                earlyEnd, lateEnd,
                task.color, task.equation);

            const options = super.render();

            for (let dayNum = 1, day = earlyStart; day < lateEnd; day = ChartTable.getInstance().calcRelativeTime(++dayNum - 1, ChartTable.getInstance().startTime)) {
                if (task.equation(day, dayNum)) {
                    html.drawDate(row, day, day,
                        new Date(day.getTime() + 24 * 60 * 60 * 1000), new Date(day.getTime() + 24 * 60 * 60 * 1000),
                        task.proportion, options as DrawOptions);
                }
            }
        });
        return null;
    }
}