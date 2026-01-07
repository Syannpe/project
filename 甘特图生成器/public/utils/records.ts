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

/*
* 工作安排逻辑：
* 一天分三部分：就业，学校，自我提升
* 如有重复按照重要度以及截止时间依次罗列
* */
// src/models/records.ts
/*刷题，框架，面试宝典，劳动法*/

// 复现代码研究创新点，JS（框架，算法，面经），病情补助，银行卡办理，轮讲，


const task1 = new Task(
    "1",
    "复现代码研究创新点",
    new Date("2025-12-18"),
    new Date("2026-1-3"),
    new Date("2025-12-18"),
    new Date("2026-1-3"),
    .7,
    function (date: Date, dayNumber: number) {
        return date.getDay() !== 0 && date.getDay() !== 6;
    }
);


const task2 = new Task(
    "2",
    "JS（框架，算法，面经）",
    new Date("2025-12-18"),
    new Date("2026-1-3"),
    new Date("2025-12-18"),
    new Date("2026-1-3"),
    .2,
    function (date: Date, dayNumber: number) {
        return date.getDay() !== 0 && date.getDay() !== 6;
    }
);
const task3 = new Task(
    "3",
    "轮讲",
    new Date("2025-12-21"),
    new Date("2025-12-24"),
    new Date("2025-12-21"),
    new Date("2025-12-24"),
    .8,
    null);

const task4 = new Task(
    "4",
    "病情补助",
    new Date("2026-1-2"),
    new Date("2026-1-3"),
    new Date("2026-1-2"),
    new Date("2026-1-3"),
    .5,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 === 0;
    }
);
const task5 = new Task(
    "5",
    "银行卡办理",
    new Date("2025-12-18"),
    new Date("2025-12-18"),
    new Date("2025-12-18"),
    new Date("2025-12-18"),
    .3,
    function (date: Date, dayNumber: number) {
        // return dayNumber % 5 !== 2 && dayNumber % 5 !== 1;
        return dayNumber % 2 !== 0;
    });


export const records: Array<(Command | Decorator)[]> = [
    [new Linear(task1)],
    [new Linear(task2)],
    [new Linear(task3)],
    [new Linear(task4)],
    [new Linear(task5)]
];