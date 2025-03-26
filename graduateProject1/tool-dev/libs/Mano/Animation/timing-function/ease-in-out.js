import { bezierCurve } from "./bezierCurve.js";
function easeInOut() {
    return bezierCurve(0.42, 0, 0.58, 1.0);
}
export { easeInOut };
