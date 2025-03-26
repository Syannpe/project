import {GradientBase} from "./GradientBase.js";

class ConicGradient extends GradientBase {
    public startAngle: number;
    public x: number;
    public y: number;


    constructor(startAngle: number,
                x: number,
                y: number) {
        super();
        this.startAngle = startAngle;
        this.x = x;
        this.y = y;
    }
}

export {ConicGradient}

