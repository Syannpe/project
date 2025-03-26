import {bezierCurve} from "./bezierCurve.js";

function easeIn(): (t: number) => { x: number, y: number } {
    return bezierCurve(0.42, 0, 1.0, 1.0);
}

export {easeIn}