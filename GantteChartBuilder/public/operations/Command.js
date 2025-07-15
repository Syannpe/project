import ChartTable from "../models/ChartTable.js";
// src/models/Command.ts
export default class Command {
    tasks;
    decorators = [];
    constructor(tasks) {
        this.tasks = tasks;
        if (tasks instanceof Array)
            tasks.forEach(task => ChartTable.getInstance().add(task));
        else
            ChartTable.getInstance().add(tasks);
    }
    /** 在页面上渲染一次命令 */
    render() {
        let obj = {};
        this.decorators.forEach(decorator => {
            obj = Object.assign(obj, decorator.handle());
        });
        return obj;
    }
}
//# sourceMappingURL=Command.js.map