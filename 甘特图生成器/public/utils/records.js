import Task from "../models/Task.js";
import Linear from "../operations/Linear.js";
/*
* 工作安排逻辑：
* 一天分三部分：就业，学校，自我提升
* 如有重复按照重要度以及截止时间依次罗列
* */
// src/models/records.ts
/*刷题，框架，面试宝典，劳动法*/
// 复现代码研究创新点，JS（框架，算法，面经），病情补助，银行卡办理，轮讲，
const task1 = new Task("修身", 1, new Date("2026-1-16"), new Date("2026-1-31"), null, null, null);
const task2 = new Task("论文/复现", .5, new Date("2026-1-16"))
    .
;
new Date("2026-1-31");
;
const task3 = new Task("技术", .4, new Date("2026-1-16"), new Date("2026-1-31"));
export const records = [
    [new Linear(task1)],
    [new Linear(task2)],
    [new Linear(task3)]
];
//# sourceMappingURL=records.js.map