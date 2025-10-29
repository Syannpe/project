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



const task1 = new Task(
    "1",
    "驾照",
    new Date("2025-11-12"),
    new Date("2025-11-15"),
    new Date("2025-11-12"),
    new Date("2025-11-15"),
    1,
    function (date: Date, dayNumber: number) {
        return dayNumber % 5 !== 0 && dayNumber % 5 !== 4;
    }
)

const task2 = new Task(
    "2",
    "软考",
    new Date("2025-10-29"),
    new Date("2025-11-8"),
    new Date("2025-10-29"),
    new Date("2025-11-8"),
    1,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 !== 1;

    });
const task3 = new Task(
    "3",
    "论文",
    new Date("2025-10-29"),
    task1.earlyStart,
    new Date("2025-10-29"),
    task1.earlyStart,
    1,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 === 1;
    }
);


const task4 = new Task(
    "4",
    "框架（琐碎的时间看）",
    new Date("2025-10-29"),
    task1.earlyStart,
    new Date("2025-10-29"),
    task1.earlyStart,
    .2,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 === 0;
    }
);
const task5 = new Task(
    "5",
    "办理提前退休（推迟）",
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    .3,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 !== 0;
    });

const task6 = new Task(
    "6",
    "算法（推迟）",
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    .5,
    function (date: Date, dayNumber: number) {
        return dayNumber % 2 === 0;
    }
);
const task7 = new Task(
    "7",
    "英语（推迟）",
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    new Date("2025-10-29"),
    .3,
    function (date: Date, dayNumber: number) {
        // return dayNumber % 5 !== 2 && dayNumber % 5 !== 1;
        return dayNumber % 2 !== 0;
    });



export const records: Array<(Command | Decorator)[]> = [
    [new Linear(task1)],
    [new Linear(task2)],
    [new Linear(task3), new After(task2)],
    [new Linear(task4), new After(task2)],
    [new Linear(task5), new After(task2)],
    [new Linear(task6)],
    [new Linear(task7)],
];