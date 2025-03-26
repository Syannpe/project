import {bezierCurve} from "./bezierCurve.js";

function ease(): (t: number) => { x: number, y: number } {
    return bezierCurve(0.25, 0.1, 0.25, 1.0);
}

export {ease}