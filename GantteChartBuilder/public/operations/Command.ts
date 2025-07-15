/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Task from "../models/Task.js";
import Decorator from "../decorators/Decorator.js";
import ChartTable from "../models/ChartTable.js";

// src/models/Command.ts

export default class Command {
    public decorators: Decorator[] = [];

    constructor(public tasks: Task | Task[]) {
        if (tasks instanceof Array)
            tasks.forEach(task => ChartTable.getInstance().add(task));
        else
            ChartTable.getInstance().add(tasks);
    }

    /** 在页面上渲染一次命令 */
    render(): Object {
        let obj = {};
        this.decorators.forEach(decorator => {
            obj = Object.assign(obj, decorator.handle());
        });

        return obj;
    }
}