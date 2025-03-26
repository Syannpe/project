import {ColorBase} from "../Fillable/ColorBase.js";

type GlobalCompositeOperation = "source-over" | "source-in" | "source-out" | "source-atop" | "destination-over" | "destination-in" | "destination-out" | "destination-atop" | "lighter" | "copy" | "xor" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";
interface CanvasOptions {
    width?: number;
    height?: number;
    clearColor?: ColorBase;
    enableFPS: boolean;
    globalAlpha?: number;
    globalCompositeOperation?: GlobalCompositeOperation;
    contextAttributes?: CanvasRenderingContext2DSettings;
}

export {CanvasOptions}