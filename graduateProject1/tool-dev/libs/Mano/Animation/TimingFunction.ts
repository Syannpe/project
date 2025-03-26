import { linear } from "./timing-function/linear.js";
import { bezierCurve } from "./timing-function/bezierCurve.js";
import { easeOut } from "./timing-function/ease-out.js";
import { easeInOut } from "./timing-function/ease-in-out.js";
import { easeIn } from "./timing-function/ease-in.js";
import { ease } from "./timing-function/ease.js";
import { linearFunction } from "./timing-function/linearFunction.js";
import { steps } from "./timing-function/steps.js";

class TimingFunction {
    public static linear: typeof linear = linear;
    public static bezierCurve: typeof bezierCurve = bezierCurve;
    public static ease: typeof ease = ease;
    public static easeIn: typeof easeIn = easeIn;
    public static easeInOut: typeof easeInOut = easeInOut;
    public static easeOut: typeof easeOut = easeOut;
    public static linearFunction: typeof linearFunction = linearFunction;
    public static steps: typeof steps = steps;
}

export {TimingFunction}