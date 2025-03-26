import { linear } from "./timing-function/linear.js";
import { bezierCurve } from "./timing-function/bezierCurve.js";
import { easeOut } from "./timing-function/ease-out.js";
import { easeInOut } from "./timing-function/ease-in-out.js";
import { easeIn } from "./timing-function/ease-in.js";
import { ease } from "./timing-function/ease.js";
import { linearFunction } from "./timing-function/linearFunction.js";
import { steps } from "./timing-function/steps.js";
class TimingFunction {
}
TimingFunction.linear = linear;
TimingFunction.bezierCurve = bezierCurve;
TimingFunction.ease = ease;
TimingFunction.easeIn = easeIn;
TimingFunction.easeInOut = easeInOut;
TimingFunction.easeOut = easeOut;
TimingFunction.linearFunction = linearFunction;
TimingFunction.steps = steps;
export { TimingFunction };
