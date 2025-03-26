import { GradientBase } from "./GradientBase.js";
class RadialGradient extends GradientBase {
    constructor(cx0, cy0, cr0, cx1, cy1, cr1) {
        super();
        this.cx0 = cx0;
        this.cy0 = cy0;
        this.cr0 = cr0;
        this.cx1 = cx1;
        this.cy1 = cy1;
        this.cr1 = cr1;
    }
}
export { RadialGradient };
