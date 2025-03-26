import {GraphicBase} from "../GraphicBase.js";
import {NonNegativeNumber} from "../../Unit/NonNegativeNumber.js";
import {Canvas} from "../../Canvas/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Text} from "./Text.js";
import {Debugger} from "../../Canvas/DebugOptions.js";
import {ColorBase} from "../../Fillable/ColorBase.js";
import {Parttern} from "../../Fillable/Parttern.js";
import {GradientBase} from "../../Fillable/GradientBase.js";
import {LinearGradient} from "../../Fillable/LinearGradient.js";
import {RadialGradient} from "../../Fillable/RadialGradient.js";
import {ConicGradient} from "../../Fillable/ConicGradient.js";
import {FillableGradientError} from "../../Exception/Fillable.GradientError.js";

class Arc2 extends GraphicBase {
    public startX: number;
    public startY: number;
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    @NonNegativeNumber
    public radius: number;

    set content(content: string) {
        super.content = content;

        let text = new Text(content, this.startX, this.startY, this.radius);
        text.textFormat = this.textFormat;
        text.textShadow = this.textShadow;
        text.textTransform = this.textTransform;
        text.font = this.font;
        text.color = this.color;
        this.appendChild(text);
    }

    get content() {
        return super.content;
    }

    updateBoundingRect(){
        let {a, b, c, d, e, f} = this.boxTransform;
        let x = Math.min(this.x1, this.x2, this.startX);
        let y = Math.min(this.y1, this.y2, this.startY);
        let width = Math.max(this.x1, this.x2, this.startX) - x;
        let height = Math.max(this.y1, this.y2, this.startY) - y;
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
        crc.shadowBlur = this?.boxShadow?.blur || 0;
        crc.shadowColor = this?.boxShadow?.color?.toString() || "rgb(255,255,255)";
        crc.shadowOffsetX = this?.boxShadow?.offsetX || 0;
        crc.shadowOffsetY = this?.boxShadow?.offsetY || 0;

        crc.lineCap = this?.border?.lineCap || "square";
        crc.lineDashOffset = this?.border?.lineDash || 10;
        crc.lineJoin = this?.border?.lineJoin || "bevel";
        crc.lineWidth = this?.border?.lineWidth || 1;

        crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));

        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();

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
        this.path.moveTo(this.startX, this.startY)
        this.path.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);

        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    constructor(startX: number,
                startY: number,
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                radius: number) {
        super();
        this.startX = startX;
        this.startY = startY;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.radius = radius;

    }
}

customElements.define("mano-arc2", Arc2);
export {Arc2}