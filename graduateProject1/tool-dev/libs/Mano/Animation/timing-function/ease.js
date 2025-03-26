import { bezierCurve } from "./bezierCurve.js";
function ease() {
    return bezierCurve(0.25, 0.1, 0.25, 1.0);
}
export { ease };
