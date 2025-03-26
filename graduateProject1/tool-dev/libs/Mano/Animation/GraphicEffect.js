//可能废弃
class GraphicEffect {
    getComputedTiming() {
        let activeDuration = this.options.duration *
            this.options.iterations;
        let endTime = this.options.delay +
            this.options.endDelay +
            activeDuration;
        return { activeDuration, endTime };
    }
}
export { GraphicEffect };
