import {GraphicBase} from "../Graphic/GraphicBase.js";
import {GraphicKeyframe} from "./GraphicKeyframe.js";
import {KeyframeEffectOptionsWithoutPseudo} from "./KeyframeEffectOptionsWithoutPseudo.js";
import {GraphicEffect} from "./GraphicEffect.js";

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
    public target: GraphicBase
    #frames: GraphicKeyframe[]
    public options: KeyframeEffectOptionsWithoutPseudo;

    public getKeyframes(): GraphicKeyframe[] {
        return this.#frames;
    }

    public setKeyframes(frames: GraphicKeyframe[] = []):void {
        this.#frames = frames;
    }

    public composite: "replace" | "add" | "accumulate"

    constructor(target: GraphicBase, frames: GraphicKeyframe[] = [], options: KeyframeEffectOptionsWithoutPseudo) {
        super();
        this.target = target;
        this.#frames = frames;
        this.options = options;
    }


}

export {GraphicKeyframeEffect}