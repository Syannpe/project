import {bezierCurve} from "./bezierCurve.js";

function easeInOut(): (t: number) => { x: number, y: number } {
    return bezierCurve(0.42, 0, 0.58, 1.0);
}

export {easeInOut}