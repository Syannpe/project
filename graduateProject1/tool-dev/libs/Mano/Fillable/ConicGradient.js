import { GradientBase } from "./GradientBase.js";
class ConicGradient extends GradientBase {
    constructor(startAngle, x, y) {
        super();
        this.startAngle = startAngle;
        this.x = x;
        this.y = y;
    }
}
export { ConicGradient };
