import {bezierCurve} from "./bezierCurve.js";

function easeOut(): (t: number) => { x: number, y: number } {
    return bezierCurve(0, 0, 0.58, 1.0);
}

export {easeOut}