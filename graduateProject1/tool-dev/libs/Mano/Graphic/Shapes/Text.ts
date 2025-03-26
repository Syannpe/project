import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Canvas/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {TextFormatInit} from "../TextFormatInit.js";
import {ColorBase} from "../../Fillable/ColorBase.js";
import {Parttern} from "../../Fillable/Parttern.js";
import {GradientBase} from "../../Fillable/GradientBase.js";
import {LinearGradient} from "../../Fillable/LinearGradient.js";
import {RadialGradient} from "../../Fillable/RadialGradient.js";
import {ConicGradient} from "../../Fillable/ConicGradient.js";
import {FillableGradientError} from "../../Exception/Fillable.GradientError.js";
import {Debugger} from "../../Canvas/DebugOptions.js";

class Text extends GraphicBase {
    public text: string;
    public x: number;
    public y: number;
    public maxWidth?: number;

    updateBoundingRect(canvas?: Canvas) {
        let x = this.x;
        let y = this.y;
        if(this.parentElement){
            x -= Number.parseFloat(this.parentElement.style.left);
            y -= Number.parseFloat(this.parentElement.style.top);
        }

        let width;
        if(this.text){
            let offscreenCanvas = new OffscreenCanvas(1,1);
            width = offscreenCanvas.getContext("2d").measureText(this.text).width;
        }else
            width = 0;

        const height = 0;
        this.setBoundingClientRect({x, y, width, height});
        let {a, b, c, d, e, f} = this.boxTransform;

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
        `
        /*this.style.display = "block";
        this.style.position = "absolute";
        this.style.left = x + "px";
        this.style.top = y + "px";
        this.style.transform = `matrix(${a},${b},${c},${d},${e},${f})`
        this.style.transformOrigin = `-${x}px -${y}px`
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.zIndex = "1";*/
        if (Debugger.graphicEdges) this.style.border = "green solid 1px";
    }
    #setStyles(crc) {
        if (this?.textFormat) {
            crc.textBaseline = this.textFormat?.textBaseline || "hanging";
            crc.textRendering = this.textFormat?.textRendering || "auto";
            crc.textAlign = this.textFormat?.textAlign || "left";
            crc.direction = this.textFormat?.direction || "ltr";
            crc.wordSpacing = this.textFormat?.wordSpacing || CSS.px(0);
            crc.letterSpacing = this.textFormat?.letterSpacing || CSS.px(0);
        }

        if (this?.textShadow) {
            crc.shadowBlur = this.textShadow?.blur || 0;
            crc.shadowColor = this.textShadow?.color?.toString() || "rgb(255,255,255)";
            crc.shadowOffsetX = this.textShadow?.offsetX || 0;
            crc.shadowOffsetY = this.textShadow?.offsetY || 0;
        }

        if (this?.font) {
            crc.fontKerning = this.font?.fontKerning || "auto";
            crc.fontStretch = this.font?.fontStretch || "normal";
            crc.fontVariantCaps = this.font?.fontVariantCaps || "normal";
            crc.font = this.font?.font || "10px  sans-serif";
        }

        crc.setTransform(this.textTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));

        if (this.color instanceof ColorBase) {
            crc.fillStyle = this.color.toString();
            crc.strokeStyle = this.color.toString();
        } else if (this.color instanceof Parttern) {
            if (!this.color.image) {
                crc.fillStyle = "rgb(0,0,0)"
                crc.strokeStyle = "rgb(0,0,0)";
            }
            crc.fillStyle = crc.createPattern(this.color.image, this.color.repetition);
            crc.strokeStyle = crc.createPattern(this.color.image, this.color.repetition);
        } else if (this.color instanceof GradientBase) {
            let gradient = null;
            if (this.color instanceof LinearGradient) {
                gradient = crc.createLinearGradient(this.color.startX, this.color.startY, this.color.endX, this.color.endY);
            } else if (this.color instanceof RadialGradient) {
                gradient = crc.createRadialGradient(this.color.cx0, this.color.cy0, this.color.cr0, this.color.cx1, this.color.cy1, this.color.cr1);
            } else if (this.color instanceof ConicGradient) {
                gradient = crc.createConicGradient(this.color.startAngle, this.color.x, this.color.y);
            }
            if (!gradient) {
                throw new FillableGradientError("渐变怎么能没有呢？");
            }

            this.color.colorStops.forEach(({offset, color}, i, a) => {
                gradient.addColorStop(offset, color.toString());
            });

            crc.fillStyle = gradient;
            crc.strokeStyle = gradient;
        }
    }

    public render(canvas: Canvas): CanvasRenderingContext2D {
        if(!this.text)return null;
        let crc: CanvasRenderingContext2D & TextFormatInit = super.render(canvas);

        crc.beginPath();
        this.#setStyles(crc);

        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fillText(this.text, this.x, this.y, this.maxWidth) :
            crc.strokeText(this.text, this.x, this.y, this.maxWidth);

        crc.closePath();
        return null;
    }

    constructor(text: string,
                x: number,
                y: number,
                maxWidth?: number
    ) {
        super();

        this.text = text;
        this.x = x;
        this.y = y;
        this.maxWidth = maxWidth;
    }
}

customElements.define("mano-text", Text);
export {Text}