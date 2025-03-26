import {bezierCurve} from "./bezierCurve.js";

function linear(): (t: number) => { x: number, y: number } {
    return bezierCurve(0.0, 0.0, 1.0, 1.0);
}

export {linear}