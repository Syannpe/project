import {GradientBase} from "./GradientBase.js";

class RadialGradient extends GradientBase {
    public cx0: number;
    public cy0: number;
    public cr0: number;
    public cx1: number;
    public cy1: number;
    public cr1: number;

    constructor(cx0: number,
                cy0: number,
                cr0: number,
                cx1: number,
                cy1: number,
                cr1: number) {
        super();
        this.cx0 = cx0;
        this.cy0 = cy0;
        this.cr0 = cr0;
        this.cx1 = cx1;
        this.cy1 = cy1;
        this.cr1 = cr1;
    }
}

export {RadialGradient}

