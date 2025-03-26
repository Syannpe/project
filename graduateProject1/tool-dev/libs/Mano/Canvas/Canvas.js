var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Canvas_counter, _Canvas_FPS, _Canvas_fpsCounter, _Canvas_CBClearOpts, _Canvas___contextChangeDefaultCallBack__, _Canvas___contextLostDefaultCallBack__;
import { RGBA } from "../Fillable/ColorFormat/RGBA.js";
import { RenderEvent } from "../Event/RenderEvent.js";
import { AfterRenderEvent } from "../Event/AfterRenderEvent.js";
import { BeforeRenderEvent } from "../Event/BeforeRenderEvent.js";
import { Debugger } from "./DebugOptions.js";
import { ContextChangeEvent } from "../Event/ContextChangeEvent.js";
import { Group } from "../Graphic/Shapes/Group.js";
class Canvas extends HTMLElement {
    /**
     * 清除画布内容的方法。
     * @param option 清除的类型，可以是 'both', 'static', 或 'dynamic'。
     */
    clear(option = "both") {
        var _a;
        if (option === "both" || option === "static") {
            let canvas = this.staticCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.staticCanvas = canvas.getContext("2d", this.canvasOptions.contextAttributes);
            this.staticCanvas.globalAlpha = this.canvasOptions.globalAlpha;
            this.staticCanvas.globalCompositeOperation = this.canvasOptions.globalCompositeOperation;
        }
        if (option === "both" || option === "dynamic") {
            let canvas = this.dynamicsCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.dynamicsCanvas = canvas.getContext("2d", this.canvasOptions.contextAttributes);
            this.dynamicsCanvas.globalAlpha = this.canvasOptions.globalAlpha;
            this.dynamicsCanvas.globalCompositeOperation = this.canvasOptions.globalCompositeOperation;
        }
        this.dynamicsCanvas.beginPath();
        this.dynamicsCanvas.rect(0, 0, this.canvasOptions.width, this.canvasOptions.height);
        this.dynamicsCanvas.fillStyle = ((_a = this.canvasOptions.clearColor) === null || _a === void 0 ? void 0 : _a.toString()) ||
            (new RGBA(255, 255, 255, 255)).toString();
        this.dynamicsCanvas.fill();
        this.dynamicsCanvas.closePath();
    }
    /**
     * 获取当前的帧率(FPS)。
     * @returns 当前的帧率。
     */
    getFPS() {
        return __classPrivateFieldGet(this, _Canvas_FPS, "f");
    }
    /**
     * 渲染方法
     * @param {number} renderTime - 渲染时间，默认为0
     * @param {"both" | "static" | "dynamic"} clearOption - 清除选项，默认为"both"
     */
    render(renderTime = 0, clearOption = "both") {
        var _a, _b;
        const p = performance;
        if (Debugger.renderFunctionInvokeTime) {
            console.log("渲染函数调用", p.now());
        }
        // 如果清除选项不等于CBClearOpts，则将其设置为CBClearOpts
        if (clearOption !== __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f"))
            clearOption = __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f");
        // 如果启用了Debugger.render，则在控制台打印计数器
        if (Debugger.render)
            console.log(__classPrivateFieldSet(this, _Canvas_counter, (_a = __classPrivateFieldGet(this, _Canvas_counter, "f"), ++_a), "f"));
        // 如果启用了FPS，则增加FPS计数器
        if (this.canvasOptions.enableFPS) {
            __classPrivateFieldSet(this, _Canvas_fpsCounter, (_b = __classPrivateFieldGet(this, _Canvas_fpsCounter, "f"), _b++, _b), "f");
        }
        // 创建一个新的渲染事件并派发
        let ev = new RenderEvent("manorender", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);
        // 清除画布
        this.clear(clearOption);
        // 移除"contextchange"事件的默认回调，以防止一些组件内部添加导致无限渲染
        this.removeEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
        if (Debugger.renderFunctionInvokeTime) {
            console.log("开始绘制前所有工作完毕", p.now());
        }
        // 遍历所有的图形元素
        let that = this;
        let renderTimeSum = 0;
        let renderTimeCount = 0;
        Array.from(this.mano.graphic.children).forEach((element, i) => {
            let startTime = p.now();
            let graphic = element;
            // 如果图形不是Group类型，并且其上下文是动态画布，且清除选项为"static"，则跳过此图形
            if (!(graphic instanceof Group) && graphic.getContext(that) === that.dynamicsCanvas && clearOption === "static") {
                return;
            }
            // 如果图形不是Group类型，并且其上下文是静态画布，且清除选项为"dynamic"，则跳过此图形
            else if (!(graphic instanceof Group) && graphic.getContext(that) === that.staticCanvas && clearOption === "dynamic") {
                return;
            }
            // 更新图形的边界矩形
            const boundingRect = graphic.getBoundingClientRect();
            // 如果图形的边界矩形超出了画布的范围，则跳过此图形
            if (boundingRect.x + boundingRect.width < 0 ||
                boundingRect.x > this.canvasOptions.width ||
                boundingRect.y + boundingRect.height < 0 ||
                boundingRect.y > this.canvasOptions.height) {
                return;
            }
            let draws = p.now();
            // 如果图形是Group类型，则调用其render方法进行渲染，否则直接调用render方法进行渲染
            if (graphic instanceof Group) {
                graphic.render(that, clearOption);
            }
            else {
                graphic.render(that);
            }
            // console.log(`第${i}遍绘制用时`, p.now() - draws);
            // 创建一个新的AfterRenderEvent事件并派发
            let ev = new AfterRenderEvent("manoafterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
            let endTime = p.now();
            if (Debugger.calculateAverageGraphicRenderTime) {
                renderTimeSum += endTime - startTime;
                renderTimeCount++;
            }
        });
        if (Debugger.calculateAverageGraphicRenderTime) {
            console.log("绘制图形的平均时间为", renderTimeSum / renderTimeCount);
        }
        // 添加"contextchange"事件的默认回调
        this.addEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
        // 设置rendering为false
        this.rendering = false;
        // 创建一个新的AfterRenderEvent事件并派发
        ev = new AfterRenderEvent("manoafterrender", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);
        if (Debugger.renderFunctionInvokeTime) {
            console.log("渲染函数结束", p.now());
        }
    }
    getContextAttributes() {
        return Object.assign(this.staticCanvas.getContextAttributes(), this.dynamicsCanvas.getContextAttributes());
    }
    /**
     * 构造函数：初始化Canvas对象。
     * @param options 可选的配置对象，用于设置画布的宽度、高度和是否启用FPS等选项。
     */
    constructor(options) {
        // 调用父类的构造函数
        super();
        /**
         * 表示渲染任务是否已经准备好
         * 通常在触发beforerender事件之后和render事件触发之前为true。
         */
        this.rendering = false;
        /**
         * 私有属性，用于内部计数。
         */
        _Canvas_counter.set(this, 0);
        /**
         * 私有属性，用于存储当前的帧率(FPS)。
         */
        _Canvas_FPS.set(this, 0);
        /**
         * 私有属性，用于帧率计数。
         */
        _Canvas_fpsCounter.set(this, 0);
        // 定义清除画布的选项：可以是"both"，"static"，"dynamic"，或者未定义。
        _Canvas_CBClearOpts.set(this, void 0);
        // 定义默认的回调函数
        _Canvas___contextChangeDefaultCallBack__.set(this, (function (e) {
            // 创建一个新的渲染事件
            let ev = new BeforeRenderEvent("manobeforerender", {
                bubbles: true,
                cancelable: true,
            });
            // 触发这个事件
            this.dispatchEvent(ev);
            // 如果没有指定清除选项，则默认为"both"
            e.clearOptions = e.clearOptions || "both";
            // 根据清除选项来设置#CBClearOpts的值
            if (e.clearOptions === "both") {
                __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
            }
            else if (e.clearOptions === "static") {
                if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "dynamic" || __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "both") {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
                }
                else if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "static" || !__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")) {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "static", "f");
                }
            }
            else if (e.clearOptions === "dynamic") {
                if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "static" || __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "both") {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
                }
                else if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "dynamic" || !__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")) {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "dynamic", "f");
                }
            }
            // 如果正在渲染，则返回
            if (this.rendering)
                return;
            // 如果开启了调试模式，则在控制台打印事件源
            if (Debugger.render)
                console.log(e.source);
            // 设置正在渲染的标志
            this.rendering = true;
            // 请求动画帧并绑定渲染函数
            requestAnimationFrame(this.render.bind(this, 0, __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")));
            // 清除#CBClearOpts的值
            __classPrivateFieldSet(this, _Canvas_CBClearOpts, undefined, "f");
        }).bind(this));
        // 定义上下文丢失的默认回调函数
        _Canvas___contextLostDefaultCallBack__.set(this, (function (e) {
            // 创建一个新的ContextChangeEvent事件
            let ev = new ContextChangeEvent("contextchange", {
                bubbles: true,
                cancelable: true,
            });
            // 触发这个事件
            this.dispatchEvent(ev);
        }).bind(this));
        // 如果没有提供选项，则使用默认选项
        if (!options) {
            options = {
                height: 150,
                width: 300,
                enableFPS: false,
                globalAlpha: 1,
                globalCompositeOperation: "source-over"
            };
            // 从属性中获取选项
            Array.from(this.attributes).forEach(attr => {
                options[attr.name] = attr.value;
            });
        }
        // 如果启用了FPS，则设置定时器来更新FPS
        if (options.enableFPS) {
            setInterval(function (that) {
                __classPrivateFieldSet(that, _Canvas_FPS, __classPrivateFieldGet(that, _Canvas_fpsCounter, "f"), "f");
                __classPrivateFieldSet(that, _Canvas_fpsCounter, 0, "f");
            }, 1000, this);
        }
        // 设置样式
        this.style.position = "absolute";
        // 设置画布ID
        this.canvasId = ++Canvas.CanvasId;
        // 设置画布选项
        this.canvasOptions = options;
        // 创建两个画布元素
        const dynamicsCanvasEle = document.createElement("canvas");
        const staticCanvasEle = document.createElement("canvas");
        // 设置画布的宽度和高度
        options.width = options.width || 300;
        options.height = options.height || 150;
        options.globalAlpha = options.globalAlpha || 1;
        options.globalCompositeOperation = options.globalCompositeOperation || "source-over";
        options.contextAttributes = options.contextAttributes || {};
        let { width, height } = options;
        dynamicsCanvasEle.width = staticCanvasEle.width = width;
        dynamicsCanvasEle.height = staticCanvasEle.height = height;
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.display = "block";
        // 设置画布的ID
        dynamicsCanvasEle.id = "mano-dynamics-canvas" + this.canvasId;
        staticCanvasEle.id = "mano-static-canvas" + this.canvasId;
        // 获取画布的2D上下文
        this.dynamicsCanvas = dynamicsCanvasEle.getContext("2d");
        this.staticCanvas = staticCanvasEle.getContext("2d");
        this.dynamicsCanvas.globalAlpha = this.canvasOptions.globalAlpha;
        this.dynamicsCanvas.globalCompositeOperation = this.canvasOptions.globalCompositeOperation;
        this.staticCanvas.globalAlpha = this.canvasOptions.globalAlpha;
        this.staticCanvas.globalCompositeOperation = this.canvasOptions.globalCompositeOperation;
        // 创建一个shadow root
        let shadowRoot = this.attachShadow({ mode: "open" });
        // 设置画布的位置
        dynamicsCanvasEle.style.position = "absolute";
        staticCanvasEle.style.position = "absolute";
        // 将画布添加到shadow root中
        shadowRoot.appendChild(dynamicsCanvasEle);
        shadowRoot.appendChild(staticCanvasEle);
        // 添加事件监听器
        this.addEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
        this.addEventListener("contextlost", __classPrivateFieldGet(this, _Canvas___contextLostDefaultCallBack__, "f"));
    }
}
_Canvas_counter = new WeakMap(), _Canvas_FPS = new WeakMap(), _Canvas_fpsCounter = new WeakMap(), _Canvas_CBClearOpts = new WeakMap(), _Canvas___contextChangeDefaultCallBack__ = new WeakMap(), _Canvas___contextLostDefaultCallBack__ = new WeakMap();
/**
 * 默认的画布ID，用于标识画布元素。
 */
Canvas.CanvasId = 0;
customElements.define("mano-canvas", Canvas);
export { Canvas };
