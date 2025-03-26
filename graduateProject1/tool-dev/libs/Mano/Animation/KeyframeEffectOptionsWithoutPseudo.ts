/*
delay?: number;
direction?: PlaybackDirection;
duration?: number | CSSNumericValue | string;
easing?: string;
endDelay?: number;
fill?: FillMode;
iterationStart?: number;
iterations?: number;
playbackRate?: number;
composite?: CompositeOperation;
iterationComposite?: IterationCompositeOperation;
*/

import {TimingFunctionType} from "./timing-function/TimingFunctionType.js";

type KeyframeEffectOptionsWithoutPseudo =
    Omit<KeyframeEffectOptions, "pseudoElement" | "easing" | "duration"> &
    { easing: TimingFunctionType, duration: number };

export {KeyframeEffectOptionsWithoutPseudo};