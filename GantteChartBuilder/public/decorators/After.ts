/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

// src/operations/After.ts
import Task from "../models/Task.js";
import Decorator from "./Decorator.js";

export default class After extends Decorator {
    constructor(public task: Task) {
        super();
    }

    public handle(): Object {
        return {after: this.task};
    }
}