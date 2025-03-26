var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GraphicKeyframeEffect_frames;
import { GraphicEffect } from "./GraphicEffect.js";
/*
* endTime 表示效果从开始到结束的时间（毫秒）。这等于activeDuration加上delay和endDelay。
* activeDuration 表示效果所有迭代的总持续时间（毫秒）。这等于duration乘以iterations（如果该乘积为NaN，则为零）。
* localTime 一个数字或null。
*   表示效果已运行的时间长度（毫秒）。这等于关联动画的currentTime，如果效果没有关联动画，则为null。
* progress null或至少为0且小于1的数字。
*   表示效果在当前迭代中的进度。在activeDuration开始时，这等于iterationStart的小数部分。
*   如果效果不在迭代中间，例如因为效果处于delay或endDelay期间，效果已完成，或localTime为null，则返回null。
* currentIteration null或一个整数数字。
*   表示当前迭代的索引。在activeDuration开始时，这等于iterationStart的整数部分。
*   当progress为null时，始终返回null。
* */
class GraphicKeyframeEffect extends GraphicEffect {
    getKeyframes() {
        return __classPrivateFieldGet(this, _GraphicKeyframeEffect_frames, "f");
    }
    setKeyframes(frames = []) {
        __classPrivateFieldSet(this, _GraphicKeyframeEffect_frames, frames, "f");
    }
    constructor(target, frames = [], options) {
        super();
        _GraphicKeyframeEffect_frames.set(this, void 0);
        this.target = target;
        __classPrivateFieldSet(this, _GraphicKeyframeEffect_frames, frames, "f");
        this.options = options;
    }
}
_GraphicKeyframeEffect_frames = new WeakMap();
export { GraphicKeyframeEffect };
