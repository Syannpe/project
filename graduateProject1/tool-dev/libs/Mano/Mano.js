import { Canvas } from "./Canvas/Canvas.js";
import { GraphicBase } from "./Graphic/GraphicBase.js";
import { Graphic } from "./Graphic/Graphic.js";
import { Animation } from "./Animation/Animation.js";
import { Color } from "./Fillable/Color.js";
import { ColorBase } from "./Fillable/ColorBase.js";
import { COLOR_NAME } from "./Fillable/COLOR_NAME.js";
import { Gradient } from "./Fillable/Gradient.js";
import { GradientBase } from "./Fillable/GradientBase.js";
import { Parttern } from "./Fillable/Parttern.js";
import { Border } from "./Graphic/Border.js";
import { FILL_TYPE } from "./Graphic/FILL_TYPE.js";
import { Font } from "./Graphic/Font.js";
import { Shadow } from "./Graphic/Shadow.js";
import { TextFormat } from "./Graphic/TextFormat.js";
import { ImageData } from "./Pixel/ImageData.js";
import { ManoMultipleInstancesError } from "./Exception/Mano.MultipleInstancesError.js";
import { ContextChangeEvent } from "./Event/ContextChangeEvent.js";
import { GraphicKeyframeEffect } from "./Animation/GraphicKeyframeEffect.js";
import { LinearInterpolation } from "./Animation/LinearInterpolation.js";
import { TimingFunction } from "./Animation/TimingFunction.js";
/**
 * 导入所需模块，包括Canvas、各类图形基类、颜色填充类、边框、字体、阴影、文本格式等组件，
 * 还有动画、图像数据、异常处理、事件处理以及关键帧动画相关类。

 * Mano类继承自HTML元素，主要用于创建和管理Canvas和Graphic元素。
 * 它提供了一个容器，可容纳一个Canvas实例和一个Graphic实例。
 */
class Mano extends HTMLElement {
    /**
     * 添加子节点到当前元素。
     * @param node 要添加的节点，可以是Canvas或Graphic实例。
     * @returns 返回添加的节点。
     * @throws 如果尝试添加多个Canvas或Graphic实例，将抛出MultipleInstancesError错误。
     */
    appendChild(node) {
        var _a;
        // 处理添加Canvas实例的情况。
        if (node instanceof Canvas)
            if (!this.canvas) {
                this.canvas = node;
                this.style.height = node.canvasOptions.height + "px";
                this.style.width = node.canvasOptions.width + "px";
                if (this.graphic) {
                    this.graphic.style.height = node.canvasOptions.height + "px";
                    this.graphic.style.width = node.canvasOptions.width + "px";
                }
            }
            else
                new ManoMultipleInstancesError("出现了多个画布实例");
        // 处理添加Graphic实例的情况。
        if (node instanceof Graphic)
            if (!this.graphic) {
                this.graphic = node;
                if (this.canvas) {
                    this.graphic.style.height = this.canvas.canvasOptions.height + "px";
                    this.graphic.style.width = this.canvas.canvasOptions.width + "px";
                }
            }
            else
                new ManoMultipleInstancesError("出现了多个图形容器实例");
        // 设置node的mano属性为当前Mano实例。
        node.mano = this;
        // 触发contextchange事件。
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        ev.source = "mano";
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.dispatchEvent(ev);
        // 调用父类的appendChild方法。
        super.appendChild(node);
        return node;
    }
    /**
     * 移除子节点。
     * @param child 要移除的子节点。
     * @returns 返回被移除的节点。
     */
    removeChild(child) {
        var _a;
        // 如果移除的节点是Canvas实例，设置canvas为null。
        if (child instanceof Canvas)
            this.canvas = null;
        // 如果移除的节点是GraphicBase实例，设置graphic为null。
        if (child instanceof GraphicBase)
            this.graphic = null;
        // 清除子节点的mano属性。
        child.mano = null;
        // 触发contextchange事件。
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.dispatchEvent(ev);
        // 调用父类的removeChild方法。
        super.removeChild(child);
        return child;
    }
    // 构造函数，初始化样式。
    constructor() {
        super();
        this.style.display = 'block';
    }
}
// 静态属性用于存储各种图形、动画和颜色等相关类的构造函数。
Mano.Canvas = Canvas;
Mano.GraphicBase = GraphicBase;
Mano.Graphic = Graphic;
Mano.Parttern = Parttern;
Mano.Border = Border;
Mano.FILL_TYPE = FILL_TYPE;
Mano.Font = Font;
Mano.Shadow = Shadow;
Mano.TextFormat = TextFormat;
Mano.Animation = Animation;
Mano.KeyframeEffect = KeyframeEffect;
Mano.GraphicKeyframeEffect = GraphicKeyframeEffect;
Mano.LinearInterpolation = LinearInterpolation;
Mano.TimingFunction = TimingFunction;
Mano.Color = Color;
Mano.ColorBase = ColorBase;
Mano.COLOR_NAME = COLOR_NAME;
Mano.Gradient = Gradient;
Mano.GradientBase = GradientBase;
Mano.ImageData = ImageData;
// 定义自定义元素"mano-main"。
customElements.define("mano-main", Mano);
export { Mano };
