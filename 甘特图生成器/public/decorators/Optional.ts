/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

// src/operations/After.ts
import Task from "../models/Task.js";
import Decorator from "./Decorator.js";

export default class Optional extends Decorator {
    constructor() {
        super();
    }

    public handle(): Object {
        return {optional: true};
    }
}