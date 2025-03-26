import { bezierCurve } from "./bezierCurve.js";
function easeOut() {
    return bezierCurve(0, 0, 0.58, 1.0);
}
export { easeOut };
