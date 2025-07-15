/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
import Command from "../operations/Command.js";
import Task from "../models/Task.js";
import Important from "../decorators/Important.js";
import Linear from "../operations/Linear.js";
import After from "../decorators/After.js";
import Loop from "../operations/Loop.js";
import Decorator from "../decorators/Decorator.js";
import Finished from "../decorators/Finished.js";

// src/models/records.ts
const task1 = new Task(
    "1",
    "MDN",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    0.25,
    function (date, dayNumber) {
        // console.log(dayNumber,dayNumber%3)
        return dayNumber % 3 === 0;
    }
);

const task2 = new Task(
    "2",
    "代码书",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    0.25,
    function (date, dayNumber) {
        return dayNumber % 3 === 1;
    }
);
const task3 = new Task(
    "3",
    "设计模式",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    0.25,
    function (date, dayNumber) {
        return dayNumber % 3 === 2;
    }
);
const task4 = new Task(
    "4",
    "论文",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    .2,
    function (date, dayNumber) {
        return dayNumber % 3 === 0 || dayNumber % 3 === 1;
    }
);
const task5 = new Task(
    "5",
    "AI基础",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    .2,
    function (date, dayNumber) {
        return dayNumber % 3 === 2;
    }
);

const task6 = new Task(
    "6",
    "英语",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    .35,
    null
);

const task7 = new Task(
    "7",
    "小提琴",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    NaN,
    function (date, dayNumber) {
        return date.getDay() >= 2 && date.getDay() <= 5
    }
);

const task8 = new Task(
    "8",
    "儒学",
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    new Date("2025-7-6"),
    new Date("2025-7-20"),
    NaN,
    null
);

const task9 = new Task(
    "9",
    "小论文",
    new Date("2025-7-6"),
    new Date("2025-7-15"),
    new Date("2025-7-6"),
    new Date("2025-7-21"),
    .4,
    null
);

export const records: Array<(Command | Decorator)[]> = [
    [new Loop(task1)],
    [new Loop(task2)],
    [new Loop(task3)],
    [new Linear(task9)],
    [new Loop(task4), new After(task9)],
    [new Loop(task5), new After(task9)],
    [new Linear(task6)],
    [new Loop(task7)],
    [new Linear(task8)],
];