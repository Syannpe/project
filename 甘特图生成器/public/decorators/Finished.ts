/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

// src/operations/Important.ts
import Task from "../models/Task.js";
import Decorator from "./Decorator.js";
import {HTMLInterface} from "../interfaces/HTMLInterface";

export default class Finished extends Decorator {
    constructor() {
        super();
    }

    public handle(): Object {
        // console.log("Important render", this.task);
        // TODO: 对重要任务高亮、加标记
        return {finished: true};


    }
}