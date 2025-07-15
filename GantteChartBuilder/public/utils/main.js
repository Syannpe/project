/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
// src/models/main.ts
import "./config.js";
import { records } from "./records.js";
import Command from "../operations/Command.js";
import Decorator from "../decorators/Decorator.js";
import { HTMLInterface } from "../interfaces/HTMLInterface.js";
import ChartTable from "../models/ChartTable.js";
export default class Main {
    static init() {
        const chart = ChartTable.getInstance();
        const duration = ChartTable.getInstance().duration;
        document.body.style.width = `${Math.min(Math.max(duration * 10, 100), 5000)}vw`;
        const totalRows = ChartTable.getInstance().tasks.length;
        document.body.style.height = `${totalRows * 5}rem`;
        HTMLInterface.getInstance().init(chart.startTime, chart.endTime);
    }
    /** 执行所有记录的渲染命令 */
    static execRecords() {
        Main.init();
        for (const cmdSet of records) {
            let decorators = [];
            let command = null;
            for (const commandOrDecorator of cmdSet) {
                if (commandOrDecorator instanceof Command)
                    command = commandOrDecorator;
                else if (commandOrDecorator instanceof Decorator)
                    decorators.push(commandOrDecorator);
            }
            command.decorators = decorators;
            command.render();
        }
    }
}
// 在应用启动时调用
Main.execRecords();
//# sourceMappingURL=main.js.map