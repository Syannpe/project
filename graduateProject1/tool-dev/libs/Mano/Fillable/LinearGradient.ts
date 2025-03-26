import {GradientBase} from "./GradientBase.js";

class LinearGradient extends GradientBase {
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;

    constructor(startX: number,
                startY: number,
                endX: number,
                endY: number) {
        super();
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY
    }
}

export {LinearGradient}

