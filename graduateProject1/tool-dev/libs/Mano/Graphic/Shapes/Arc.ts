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

class Arc extends GraphicBase {
    public x: number;
    public y: number;
    @NonNegativeNumber
    public radius: number;
    public startAngle: number;
    public endAngle: number;
    public counterclockwise?: boolean;

    set content(content: string) {
        super.content = content;

        let text = new Text(content, this.x, this.y, this.radius);
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
        let x = this.x - this.radius;
        let y = this.y - this.radius;
        let width = this.radius * 2;
        let height = this.radius * 2;
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
        this.path.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterclockwise);

        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    constructor(x: number,
                y: number,
                radius: number,
                startAngle: number,
                endAngle: number,
                counterclockwise?: boolean) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterclockwise = counterclockwise;

    }
}

customElements.define("mano-arc", Arc);
export {Arc}