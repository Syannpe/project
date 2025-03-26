import { GradientBase } from "./GradientBase.js";
class LinearGradient extends GradientBase {
    constructor(startX, startY, endX, endY) {
        super();
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}
export { LinearGradient };
