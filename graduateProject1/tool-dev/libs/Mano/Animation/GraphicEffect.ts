import {GraphicKeyframeEffect} from "./GraphicKeyframeEffect";

//可能废弃
class GraphicEffect {
    public getComputedTiming(this: GraphicKeyframeEffect) {
        let activeDuration =
            this.options.duration *
            this.options.iterations;
        let endTime = this.options.delay +
            this.options.endDelay +
            activeDuration;
        return {activeDuration, endTime};
    }
}

export {GraphicEffect}