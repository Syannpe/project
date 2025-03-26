import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Canvas/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Debugger} from "../../Canvas/DebugOptions.js";
import {Parttern} from "../../Fillable/Parttern.js";
import {ColorBase} from "../../Fillable/ColorBase.js";
import {GradientBase} from "../../Fillable/GradientBase.js";
import {LinearGradient} from "../../Fillable/LinearGradient.js";
import {RadialGradient} from "../../Fillable/RadialGradient.js";
import {ConicGradient} from "../../Fillable/ConicGradient.js";
import {ImageInit} from "./ImageInit.js";
import {ImageObject} from "../../Fillable/ImageObject.js";
import {FillableGradientError} from "../../Exception/Fillable.GradientError.js";
import {GraphicInvalidImage} from "../../Exception/Graphic.InvalidImage.js";

class Image extends GraphicBase {
    public image: ImageObject;
    public imageX: number;
    public imageY: number;
    public imageWidth: number;
    public imageHeight: number;
    public startX: number;
    public startY: number;
    public rectWidth: number;
    public rectHeight: number;
    public imageSmoothingEnabled: boolean = true;
    public imageSmoothingQuality: "low" | "medium" | "high" = "high";

    updateBoundingRect(){
        const x = this.startX;
        const y = this.startY;
        const width = this.rectWidth;
        const height = this.rectHeight;
        let {a, b, c, d, e, f} = this.boxTransform;
        this.setBoundingClientRect({x, y, width, height});

        this.style.cssText = `
        display:block;
        position:absolute;
        z-index:1;
        left:${x}px;
        top:${y}px;
        transform:matrix(${a},${b},${c},${d},${e},${f});
        transform-origin:-${x}px -${y}px;
        width:${width}px;
        height:${height}px;
        `;
        if (Debugger.graphicEdges) this.style.border = "green solid 1px";
    }

    #setStyles(crc: CanvasRenderingContext2D) {
        crc.imageSmoothingEnabled = this.imageSmoothingEnabled;
        crc.imageSmoothingQuality = this.imageSmoothingQuality;

        crc.shadowBlur = this?.boxShadow?.blur || 0;
        crc.shadowColor = this?.boxShadow?.color?.toString() || "rgb(255,255,255)";
        crc.shadowOffsetX = this?.boxShadow?.offsetX || 0;
        crc.shadowOffsetY = this?.boxShadow?.offsetY || 0;

        crc.lineCap = this?.border?.lineCap || "square";
        crc.lineDashOffset = this?.border?.lineDash || 10;
        crc.lineJoin = this?.border?.lineJoin || "bevel";
        crc.lineWidth = this?.border?.lineWidth || 1;

        crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));

        if (this.backgroundColor instanceof ColorBase) {
            crc.fillStyle = this.backgroundColor.toString();
            crc.strokeStyle = this.backgroundColor.toString();
        } else if (this.backgroundColor instanceof Parttern) {
            if (!this.backgroundColor.image) {
                crc.fillStyle = "rgb(0,0,0)"
                crc.strokeStyle = "rgb(0,0,0)";
            }
            crc.fillStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
            crc.strokeStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
        } else if (this.backgroundColor instanceof GradientBase) {
            let gradient = null;
            if (this.backgroundColor instanceof LinearGradient) {
                gradient = crc.createLinearGradient(this.backgroundColor.startX, this.backgroundColor.startY, this.backgroundColor.endX, this.backgroundColor.endY);
            } else if (this.backgroundColor instanceof RadialGradient) {
                gradient = crc.createRadialGradient(this.backgroundColor.cx0, this.backgroundColor.cy0, this.backgroundColor.cr0, this.backgroundColor.cx1, this.backgroundColor.cy1, this.backgroundColor.cr1);
            } else if (this.backgroundColor instanceof ConicGradient) {
                gradient = crc.createConicGradient(this.backgroundColor.startAngle, this.backgroundColor.x, this.backgroundColor.y);
            }
            if (!gradient) {
                throw new FillableGradientError("渐变怎么能没有呢？");
            }

            this.backgroundColor.colorStops.forEach(({offset, color}, i, a) => {
                gradient.addColorStop(offset, color.toString());
            });

            crc.fillStyle = gradient;
            crc.strokeStyle = gradient;
        }
    }

    public render(canvas: Canvas): CanvasRenderingContext2D {
        let crc = super.render(canvas);

        crc.beginPath();
        this.#setStyles(crc);
        this.content = this.content || "";

        this.path = new Path2D();
        this.path.rect(this.startX, this.startY, this.rectWidth, this.rectHeight);

        if (!this.imageX && !this.imageY && !this.imageWidth && !this.imageHeight && !this.rectWidth && !this.rectHeight) {
            crc.drawImage(this.image, this.startX, this.startY);
        } else if (!this.imageX && !this.imageY && !this.imageWidth && !this.imageHeight) {
            crc.drawImage(this.image, this.startX, this.startY, this.rectWidth, this.rectHeight);
        } else if (this.imageX && this.imageY && this.imageWidth && this.imageHeight && this.rectWidth && this.rectHeight && this.startX && this.startY && this.image) {
            crc.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.startX, this.startY, this.rectWidth, this.rectHeight);
        } else if (!this.image && this.rectWidth && this.rectHeight && this.startX && this.startY) {

            this.fillType === FILL_TYPE.GRAPHIC_FILL ?
                crc.fill(this.path) :
                crc.stroke(this.path);
        } else {
            throw new GraphicInvalidImage("图片参数成功排除了所有可能性")
        }

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    constructor(init: ImageInit
    ) {
        super();
        this.image = init.image;
        this.imageX = init.imageX;
        this.imageY = init.imageY;
        this.imageWidth = init.imageWidth;
        this.imageHeight = init.imageHeight;
        this.startX = init.startX;
        this.startY = init.startY;
        this.rectWidth = init.rectWidth || (this.image as {width:number})?.width;
        this.rectHeight = init.rectHeight || (this.image as {height:number})?.height;

    }
}

customElements.define("mano-image", Image);
export {Image}