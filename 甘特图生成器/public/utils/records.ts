/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Command from "../operations/Command.js";
import Task from "../models/Task.js";
import Linear from "../operations/Linear.js";
import Loop from "../operations/Loop.js";
import Decorator from "../decorators/Decorator.js";
import After from "../decorators/After.js";
import Finished from "../decorators/Finished.js";
import Optional from "../decorators/Optional.js";

/*
* 工作安排逻辑：
* 一天分三部分：就业，学校，自我提升
* 如有重复按照重要度以及截止时间依次罗列
* */
// src/models/records.ts
/*刷题，框架，面试宝典，劳动法*/

// 复现代码研究创新点，JS（框架，算法，面经），病情补助，银行卡办理，轮讲，


const task1 = new Task(
    "#001 论文创新点",
    .3,
    new Date("2026-3-24"),
    new Date("2026-4-1"),
);

const task2 = new Task(
    "#002 确立工作目标",
    .3,
    new Date("2026-3-24"),
    new Date("2026-4-1"),
);
const task3 = new Task(
    "#003 英语六级（小步优化推进）",
    .2,
    new Date("2026-3-24"),
    new Date("2026-4-1"),
);
const task4 = new Task(
    "#005 练习小提琴（做最小验证版）",
    .1,
    new Date("2026-3-24"),
    new Date("2026-4-1"),
);

export const records: Array<(Command | Decorator)[]> = [
    [new Linear(task1)],
    [new Linear(task2)],
    [new Linear(task3)],
    [new Linear(task4), new Optional()]
];