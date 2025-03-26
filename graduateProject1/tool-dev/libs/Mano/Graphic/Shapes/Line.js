var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Line_instances, _Line_setStyles;
import { GraphicBase } from "../GraphicBase.js";
import { FILL_TYPE } from "../FILL_TYPE.js";
import { Text } from "./Text.js";
import { Debugger } from "../../Canvas/DebugOptions.js";
import { ColorBase } from "../../Fillable/ColorBase.js";
import { Parttern } from "../../Fillable/Parttern.js";
import { GradientBase } from "../../Fillable/GradientBase.js";
import { LinearGradient } from "../../Fillable/LinearGradient.js";
import { RadialGradient } from "../../Fillable/RadialGradient.js";
import { ConicGradient } from "../../Fillable/ConicGradient.js";
import { FillableGradientError } from "../../Exception/Fillable.GradientError.js";
class Line extends GraphicBase {
    set content(content) {
        super.content = content;
        let text = new Text(content, this.startX, this.startY, this.endX - this.startX);
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
    updateBoundingRect() {
        let { a, b, c, d, e, f } = this.boxTransform;
        let x = Math.min(this.startX, this.endX);
        let y = Math.min(this.startY, this.endY);
        let width = Math.max(this.startX, this.endX) - x;
        let height = Math.max(this.startY, this.endY) - y;
        this.setBoundingClientRect({ x, y, width, height });
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
        if (Debugger.graphicEdges)
            this.style.border = "green solid 1px";
    }
    render(canvas) {
        let crc = super.render(canvas);
        crc.beginPath();
        __classPrivateFieldGet(this, _Line_instances, "m", _Line_setStyles).call(this, crc);
        this.content = this.content || "";
        this.path = new Path2D();
        this.path.moveTo(this.startX, this.startY);
        this.path.lineTo(this.endX, this.endY);
        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);
        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }
    constructor(startX, startY, endX, endY) {
        super();
        _Line_instances.add(this);
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}
_Line_instances = new WeakSet(), _Line_setStyles = function _Line_setStyles(crc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    crc.shadowBlur = ((_a = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _a === void 0 ? void 0 : _a.blur) || 0;
    crc.shadowColor = ((_c = (_b = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _b === void 0 ? void 0 : _b.color) === null || _c === void 0 ? void 0 : _c.toString()) || "rgb(255,255,255)";
    crc.shadowOffsetX = ((_d = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _d === void 0 ? void 0 : _d.offsetX) || 0;
    crc.shadowOffsetY = ((_e = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _e === void 0 ? void 0 : _e.offsetY) || 0;
    crc.lineCap = ((_f = this === null || this === void 0 ? void 0 : this.border) === null || _f === void 0 ? void 0 : _f.lineCap) || "square";
    crc.lineDashOffset = ((_g = this === null || this === void 0 ? void 0 : this.border) === null || _g === void 0 ? void 0 : _g.lineDash) || 10;
    crc.lineJoin = ((_h = this === null || this === void 0 ? void 0 : this.border) === null || _h === void 0 ? void 0 : _h.lineJoin) || "bevel";
    crc.lineWidth = ((_j = this === null || this === void 0 ? void 0 : this.border) === null || _j === void 0 ? void 0 : _j.lineWidth) || 1;
    crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));
    if (this.backgroundColor instanceof ColorBase) {
        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();
    }
    else if (this.backgroundColor instanceof Parttern) {
        if (!this.backgroundColor.image) {
            crc.fillStyle = "rgb(0,0,0)";
            crc.strokeStyle = "rgb(0,0,0)";
        }
        crc.fillStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
        crc.strokeStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
    }
    else if (this.backgroundColor instanceof GradientBase) {
        let gradient = null;
        if (this.backgroundColor instanceof LinearGradient) {
            gradient = crc.createLinearGradient(this.backgroundColor.startX, this.backgroundColor.startY, this.backgroundColor.endX, this.backgroundColor.endY);
        }
        else if (this.backgroundColor instanceof RadialGradient) {
            gradient = crc.createRadialGradient(this.backgroundColor.cx0, this.backgroundColor.cy0, this.backgroundColor.cr0, this.backgroundColor.cx1, this.backgroundColor.cy1, this.backgroundColor.cr1);
        }
        else if (this.backgroundColor instanceof ConicGradient) {
            gradient = crc.createConicGradient(this.backgroundColor.startAngle, this.backgroundColor.x, this.backgroundColor.y);
        }
        if (!gradient) {
            throw new FillableGradientError("渐变怎么能没有呢？");
        }
        this.backgroundColor.colorStops.forEach(({ offset, color }, i, a) => {
            gradient.addColorStop(offset, color.toString());
        });
        crc.fillStyle = gradient;
        crc.strokeStyle = gradient;
    }
};
customElements.define("mano-line", Line);
export { Line };
