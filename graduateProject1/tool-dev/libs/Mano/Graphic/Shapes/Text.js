var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Text_instances, _Text_setStyles;
import { GraphicBase } from "../GraphicBase.js";
import { FILL_TYPE } from "../FILL_TYPE.js";
import { ColorBase } from "../../Fillable/ColorBase.js";
import { Parttern } from "../../Fillable/Parttern.js";
import { GradientBase } from "../../Fillable/GradientBase.js";
import { LinearGradient } from "../../Fillable/LinearGradient.js";
import { RadialGradient } from "../../Fillable/RadialGradient.js";
import { ConicGradient } from "../../Fillable/ConicGradient.js";
import { FillableGradientError } from "../../Exception/Fillable.GradientError.js";
import { Debugger } from "../../Canvas/DebugOptions.js";
class Text extends GraphicBase {
    updateBoundingRect(canvas) {
        let x = this.x;
        let y = this.y;
        if (this.parentElement) {
            x -= Number.parseFloat(this.parentElement.style.left);
            y -= Number.parseFloat(this.parentElement.style.top);
        }
        let width;
        if (this.text) {
            let offscreenCanvas = new OffscreenCanvas(1, 1);
            width = offscreenCanvas.getContext("2d").measureText(this.text).width;
        }
        else
            width = 0;
        const height = 0;
        this.setBoundingClientRect({ x, y, width, height });
        let { a, b, c, d, e, f } = this.boxTransform;
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
        /*this.style.display = "block";
        this.style.position = "absolute";
        this.style.left = x + "px";
        this.style.top = y + "px";
        this.style.transform = `matrix(${a},${b},${c},${d},${e},${f})`
        this.style.transformOrigin = `-${x}px -${y}px`
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.zIndex = "1";*/
        if (Debugger.graphicEdges)
            this.style.border = "green solid 1px";
    }
    render(canvas) {
        if (!this.text)
            return null;
        let crc = super.render(canvas);
        crc.beginPath();
        __classPrivateFieldGet(this, _Text_instances, "m", _Text_setStyles).call(this, crc);
        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fillText(this.text, this.x, this.y, this.maxWidth) :
            crc.strokeText(this.text, this.x, this.y, this.maxWidth);
        crc.closePath();
        return null;
    }
    constructor(text, x, y, maxWidth) {
        super();
        _Text_instances.add(this);
        this.text = text;
        this.x = x;
        this.y = y;
        this.maxWidth = maxWidth;
    }
}
_Text_instances = new WeakSet(), _Text_setStyles = function _Text_setStyles(crc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (this === null || this === void 0 ? void 0 : this.textFormat) {
        crc.textBaseline = ((_a = this.textFormat) === null || _a === void 0 ? void 0 : _a.textBaseline) || "hanging";
        crc.textRendering = ((_b = this.textFormat) === null || _b === void 0 ? void 0 : _b.textRendering) || "auto";
        crc.textAlign = ((_c = this.textFormat) === null || _c === void 0 ? void 0 : _c.textAlign) || "left";
        crc.direction = ((_d = this.textFormat) === null || _d === void 0 ? void 0 : _d.direction) || "ltr";
        crc.wordSpacing = ((_e = this.textFormat) === null || _e === void 0 ? void 0 : _e.wordSpacing) || CSS.px(0);
        crc.letterSpacing = ((_f = this.textFormat) === null || _f === void 0 ? void 0 : _f.letterSpacing) || CSS.px(0);
    }
    if (this === null || this === void 0 ? void 0 : this.textShadow) {
        crc.shadowBlur = ((_g = this.textShadow) === null || _g === void 0 ? void 0 : _g.blur) || 0;
        crc.shadowColor = ((_j = (_h = this.textShadow) === null || _h === void 0 ? void 0 : _h.color) === null || _j === void 0 ? void 0 : _j.toString()) || "rgb(255,255,255)";
        crc.shadowOffsetX = ((_k = this.textShadow) === null || _k === void 0 ? void 0 : _k.offsetX) || 0;
        crc.shadowOffsetY = ((_l = this.textShadow) === null || _l === void 0 ? void 0 : _l.offsetY) || 0;
    }
    if (this === null || this === void 0 ? void 0 : this.font) {
        crc.fontKerning = ((_m = this.font) === null || _m === void 0 ? void 0 : _m.fontKerning) || "auto";
        crc.fontStretch = ((_o = this.font) === null || _o === void 0 ? void 0 : _o.fontStretch) || "normal";
        crc.fontVariantCaps = ((_p = this.font) === null || _p === void 0 ? void 0 : _p.fontVariantCaps) || "normal";
        crc.font = ((_q = this.font) === null || _q === void 0 ? void 0 : _q.font) || "10px  sans-serif";
    }
    crc.setTransform(this.textTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));
    if (this.color instanceof ColorBase) {
        crc.fillStyle = this.color.toString();
        crc.strokeStyle = this.color.toString();
    }
    else if (this.color instanceof Parttern) {
        if (!this.color.image) {
            crc.fillStyle = "rgb(0,0,0)";
            crc.strokeStyle = "rgb(0,0,0)";
        }
        crc.fillStyle = crc.createPattern(this.color.image, this.color.repetition);
        crc.strokeStyle = crc.createPattern(this.color.image, this.color.repetition);
    }
    else if (this.color instanceof GradientBase) {
        let gradient = null;
        if (this.color instanceof LinearGradient) {
            gradient = crc.createLinearGradient(this.color.startX, this.color.startY, this.color.endX, this.color.endY);
        }
        else if (this.color instanceof RadialGradient) {
            gradient = crc.createRadialGradient(this.color.cx0, this.color.cy0, this.color.cr0, this.color.cx1, this.color.cy1, this.color.cr1);
        }
        else if (this.color instanceof ConicGradient) {
            gradient = crc.createConicGradient(this.color.startAngle, this.color.x, this.color.y);
        }
        if (!gradient) {
            throw new FillableGradientError("渐变怎么能没有呢？");
        }
        this.color.colorStops.forEach(({ offset, color }, i, a) => {
            gradient.addColorStop(offset, color.toString());
        });
        crc.fillStyle = gradient;
        crc.strokeStyle = gradient;
    }
};
customElements.define("mano-text", Text);
export { Text };
