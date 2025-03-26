import {GraphicBase} from "../Graphic/GraphicBase.js"
import {CanvasOptions} from "./CanvasOptions.js";
import {Mano} from "../Mano.js";
import {RGBA} from "../Fillable/ColorFormat/RGBA.js";
import {RenderEvent} from "../Event/RenderEvent.js";
import {AfterRenderEvent} from "../Event/AfterRenderEvent.js";
import {BeforeRenderEvent} from "../Event/BeforeRenderEvent.js";
import {Debugger} from "./DebugOptions.js";
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";
import {Group} from "../Graphic/Shapes/Group.js";

class Canvas extends HTMLElement {
    public mano: Mano;

    /**
     * 默认的画布ID，用于标识画布元素。
     */
    public static CanvasId: number = 0;

    /**
     * 实例的画布ID，用于标识特定的画布元素。
     */
    public canvasId: number;

    /**
     * 动态画布的渲染上下文，用于绘制动态内容。
     */
    public dynamicsCanvas: CanvasRenderingContext2D;

    /**
     * 静态画布的渲染上下文，用于绘制静态内容。
     */
    public staticCanvas: CanvasRenderingContext2D;

    /**
     * 画布的配置选项。
     */
    public canvasOptions: CanvasOptions;

    /**
     * 表示渲染任务是否已经准备好
     * 通常在触发beforerender事件之后和render事件触发之前为true。
     */
    public rendering: boolean = false;

    /**
     * 清除画布内容的方法。
     * @param option 清除的类型，可以是 'both', 'static', 或 'dynamic'。
     */
    public clear(option: "both" | "static" | "dynamic" = "both"): void {
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
        this.dynamicsCanvas.fillStyle = this.canvasOptions.clearColor?.toString() ||
            (new RGBA(255, 255, 255, 255)).toString();
        this.dynamicsCanvas.fill();
        this.dynamicsCanvas.closePath();
    }

    /**
     * 私有属性，用于内部计数。
     */
    #counter = 0;

    /**
     * 私有属性，用于存储当前的帧率(FPS)。
     */
    #FPS = 0;

    /**
     * 私有属性，用于帧率计数。
     */
    #fpsCounter = 0;

    /**
     * 获取当前的帧率(FPS)。
     * @returns 当前的帧率。
     */
    public getFPS(): number {
        return this.#FPS;
    }

    /**
     * 渲染方法
     * @param {number} renderTime - 渲染时间，默认为0
     * @param {"both" | "static" | "dynamic"} clearOption - 清除选项，默认为"both"
     */
    public render(renderTime = 0, clearOption: "both" | "static" | "dynamic" = "both"): void {
        const p = performance;

        if (Debugger.renderFunctionInvokeTime) {
            console.log("渲染函数调用", p.now());
        }
        // 如果清除选项不等于CBClearOpts，则将其设置为CBClearOpts
        if (clearOption !== this.#CBClearOpts)
            clearOption = this.#CBClearOpts;

        // 如果启用了Debugger.render，则在控制台打印计数器
        if (Debugger.render)
            console.log(++this.#counter);

        // 如果启用了FPS，则增加FPS计数器
        if (this.canvasOptions.enableFPS) {
            this.#fpsCounter++;
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
        this.removeEventListener("contextchange", this.#__contextChangeDefaultCallBack__)

        if (Debugger.renderFunctionInvokeTime) {
            console.log("开始绘制前所有工作完毕", p.now());
        }
        // 遍历所有的图形元素
        let that = this;

        let renderTimeSum = 0;
        let renderTimeCount = 0;
        Array.from(this.mano.graphic.children).forEach((element, i) => {
            let startTime = p.now();

            let graphic = element as GraphicBase;

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
            } else {
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
        this.addEventListener("contextchange", this.#__contextChangeDefaultCallBack__)

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

    public getContextAttributes() {
        return Object.assign(this.staticCanvas.getContextAttributes(), this.dynamicsCanvas.getContextAttributes());
    }

    // 定义清除画布的选项：可以是"both"，"static"，"dynamic"，或者未定义。
    #CBClearOpts: "both" | "static" | "dynamic" | undefined;

    // 定义默认的回调函数
    #__contextChangeDefaultCallBack__ = (function (e: ContextChangeEvent) {
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
            this.#CBClearOpts = "both"
        } else if (e.clearOptions === "static") {
            if (this.#CBClearOpts === "dynamic" || this.#CBClearOpts === "both") {
                this.#CBClearOpts = "both"
            } else if (this.#CBClearOpts === "static" || !this.#CBClearOpts) {
                this.#CBClearOpts = "static"
            }
        } else if (e.clearOptions === "dynamic") {
            if (this.#CBClearOpts === "static" || this.#CBClearOpts === "both") {
                this.#CBClearOpts = "both"
            } else if (this.#CBClearOpts === "dynamic" || !this.#CBClearOpts) {
                this.#CBClearOpts = "dynamic"
            }
        }
        // 如果正在渲染，则返回
        if (this.rendering) return;

        // 如果开启了调试模式，则在控制台打印事件源
        if (Debugger.render)
            console.log(e.source);

        // 设置正在渲染的标志
        this.rendering = true;

        // 请求动画帧并绑定渲染函数
        requestAnimationFrame(this.render.bind(this, 0, this.#CBClearOpts));
        // 清除#CBClearOpts的值
        this.#CBClearOpts = undefined;
    }).bind(this);

    // 定义上下文丢失的默认回调函数
    #__contextLostDefaultCallBack__ = (function (e) {
        // 创建一个新的ContextChangeEvent事件
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        // 触发这个事件
        this.dispatchEvent(ev);
    }).bind(this);

    /**
     * 构造函数：初始化Canvas对象。
     * @param options 可选的配置对象，用于设置画布的宽度、高度和是否启用FPS等选项。
     */
    constructor(options?: CanvasOptions) {
        // 调用父类的构造函数
        super();

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
                options[attr.name] = attr.value
            });
        }

        // 如果启用了FPS，则设置定时器来更新FPS
        if (options.enableFPS) {
            setInterval(function (that: Canvas) {
                that.#FPS = that.#fpsCounter;
                that.#fpsCounter = 0;
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

        let {width, height} = options;
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
        let shadowRoot = this.attachShadow({mode: "open"});

        // 设置画布的位置
        dynamicsCanvasEle.style.position = "absolute";
        staticCanvasEle.style.position = "absolute";

        // 将画布添加到shadow root中
        shadowRoot.appendChild(dynamicsCanvasEle);
        shadowRoot.appendChild(staticCanvasEle);

        // 添加事件监听器
        this.addEventListener("contextchange", this.#__contextChangeDefaultCallBack__)
        this.addEventListener("contextlost", this.#__contextLostDefaultCallBack__)
    }
}

customElements.define("mano-canvas", Canvas);

export {Canvas}
