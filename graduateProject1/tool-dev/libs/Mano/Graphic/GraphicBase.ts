import {TextFormat} from "./TextFormat.js"
import {Shadow} from "./Shadow.js"
import {Border} from "./Border.js"
import {Font} from "./Font.js"
import {FILL_TYPE} from "./FILL_TYPE.js"
import {Fillable} from "../Fillable/Fillable.js"
import {Canvas} from "../Canvas/Canvas.js";
import {Animation} from "../Animation/Animation.js";
import {RGBA} from "../Fillable/ColorFormat/RGBA.js";
import {RenderEvent} from "../Event/RenderEvent.js";
import {AfterRenderEvent} from "../Event/AfterRenderEvent.js";
import {Mano} from "../Mano.js";
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";
import {FILL_RULE} from "./FILL_RULE.js";
import {GraphicEventRegister} from "./GraphicEventRegister.js";

// GraphicBase类继承自GraphicEventRegister类，提供图形基类的实现
class GraphicBase extends GraphicEventRegister {
    // 定义路径属性，用于存储图形路径信息
    public path: Path2D = null;

    // 定义Mano对象引用，可能与canvas上下文或其他图形渲染相关
    public mano: Mano;

    // DOM内置getBoundingClientRect()方法执行时间过长，所以要自己做一个
    #__boundingRect__: DOMRect;

    public getBoundingClientRect(): DOMRect {
        this.updateBoundingRect();

        return this.#__boundingRect__;
    }

    protected setBoundingClientRect({x, y, width, height}): void {
        this.#__boundingRect__ = new DOMRect(x, y, width, height);
    }

    // 更新边界矩形的方法
    // public updateBoundingRect(): void
    public updateBoundingRect(): void {
        // 此处应实现更新图形边界矩形的具体逻辑
    }

    // 私有方法，用于触发重新绘制
    #redraw(options?: "both" | "static" | "dynamic") {
        // 创建一个ContextChangeEvent事件，并设置其源为"graphic base"
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        ev.source = "graphic base";

        // 根据当前动画状态设定清除选项
        if (this.#__animation__) ev.clearOptions = "dynamic";
        else ev.clearOptions = "static";

        // 若传入了options参数，则覆盖默认清除选项
        if (options) ev.clearOptions = options;

        // 将事件发送到关联的canvas元素上
        this.mano?.canvas?.dispatchEvent(ev);
    }

    // 私有内容字符串属性
    #__content__: string;

    // 内容属性的getter方法
    public get content(): string {
        return this.#__content__;
    }

    // 内容属性的setter方法，设置内容后会删除现有子元素并触发重新绘制
    public set content(content: string) {
        this.#__content__ = content;

        // 删除已存在的第一个子元素（可能是文本元素）
        this.children[0] && this.removeChild(this.children[0]);

        // 触发重新绘制
        this.#redraw();
    }

    // 私有的文本格式化对象
    #__textFormat__: TextFormat = new TextFormat({textBaseline: "hanging"});

    // 获取文本格式化对象的方法
    public get textFormat(): TextFormat {
        return this.#__textFormat__;
    }

    // 设置文本格式化对象的方法，当对象属性变化时会触发重新绘制
    set textFormat(v: TextFormat) {
        let that = this;

        // 如果v是一个对象，则创建代理以在属性更改时自动触发重新绘制
        if (v && typeof v === "object") {
            this.#__textFormat__ = new Proxy(v, {
                set(target: TextFormat, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__textShadow__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    // 私有的box-shadow对象
    #__boxShadow__: Shadow;

    // 获取box-shadow对象的方法
    public get boxShadow(): Shadow {
        return this.#__boxShadow__;
    }

    // 设置box-shadow对象的方法，当对象属性变化时会触发重新绘制
    public set boxShadow(v: Shadow) {
        let that = this;

        if (v && typeof v === "object")
            this.#__boxShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        else if (!v) {
            this.#__boxShadow__ = null;
            that.#redraw();
        }
        this.#redraw();
    }

    // 私有的text-shadow对象
    #__textShadow__: Shadow;

    // 获取text-shadow对象的方法
    public get textShadow(): Shadow {
        return this.#__textShadow__;
    }

    // 设置text-shadow对象的方法，当对象属性变化时会触发重新绘制及文本元素的重新创建和绘制
    public set textShadow(v: Shadow) {
        const that = this;

        // 如果v是一个对象，则创建代理以在属性更改时自动触发重新绘制
        if (v && typeof v === "object") {
            this.#__textShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__textShadow__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    // 私有的边框对象
    #__border__: Border;

    // 获取边框对象的方法
    public get border(): Border {
        return this.#__border__;
    }

    // 设置边框对象的方法，当对象属性变化时会触发重新绘制
    public set border(v: Border) {
        const that = this;

        // 如果v是一个对象，则创建代理以在属性更改时自动触发重新绘制
        if (v && typeof v === "object")
            this.#__border__ = new Proxy(v, {
                set(target: Border, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        else if (!v) {
            this.#__border__ = null;
        }

        this.#redraw();
    }

    // 私有的字体对象
    #__font__: Font;

    // 获取字体对象的方法
    public get font(): Font {
        return this.#__font__;
    }

    // 设置字体对象的方法，当对象属性变化时会触发重新绘制及文本元素的重新创建和绘制
    public set font(v: Font) {
        const that = this;

        // 如果v是一个对象，则创建代理以在属性更改时自动触发重新绘制
        if (v && typeof v === "object") {
            this.#__font__ = new Proxy(v, {
                set(target: Font, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__font__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    // 当前框体变换矩阵属性
    public currentBoxTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

// 继承框体变换矩阵属性
    public inheritBoxTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

// 获取组合后的框体变换矩阵（当前框体变换与继承框体变换相乘）
    public get boxTransform() {
        return this.inheritBoxTransform.multiply(this.currentBoxTransform);
    }

// 设置当前框体变换矩阵，并触发重新绘制
    set boxTransform(v: DOMMatrixReadOnly) {
        this.currentBoxTransform = v;
        this.#redraw();
    }

    // 当前文本变换矩阵属性
    public currentTextTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

    // 继承文本变换矩阵属性
    public inheritTextTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

    // 获取组合后的文本变换矩阵（当前文本变换、当前框体变换与继承文本变换相乘）
    get textTransform() {
        return this.inheritTextTransform.multiply(this.currentTextTransform).multiply(this.currentBoxTransform);
    }

// 设置当前文本变换矩阵，并强制重新创建和绘制文本元素
    set textTransform(v: DOMMatrixReadOnly) {
        this.currentTextTransform = v;
        this.content = this.content;
    }

// 私有填充类型枚举属性
    #__fillType__: FILL_TYPE = FILL_TYPE.GRAPHIC_FILL;

// 获取填充类型的方法
    get fillType() {
        return this.#__fillType__;
    }

// 设置填充类型的方法，设置后触发重新绘制
    set fillType(v: FILL_TYPE) {
        this.#__fillType__ = v;
        this.#redraw();
    }

// 私有填充规则枚举属性
    #__fillRule__: FILL_RULE = FILL_RULE.NONZERO;

// 获取填充规则的方法
    get fillRule() {
        return this.#__fillRule__;
    }

// 设置填充规则的方法，设置后触发重新绘制
    set fillRule(v: FILL_RULE) {
        this.#__fillRule__ = v;
        this.#redraw();
    }

    // 私有背景颜色属性
    #__backgroundColor__: Fillable = new RGBA(0, 0, 0);

// 获取背景颜色的方法
    get backgroundColor() {
        return this.#__backgroundColor__;
    }

// 设置背景颜色的方法，当对象属性变化时会触发重新绘制
    set backgroundColor(v: Fillable) {
        let that = this;

// 如果v是一个对象，则创建代理以在属性更改时自动触发重新绘制
        if (v && typeof v === "object")
            this.#__backgroundColor__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
// 不论如何都触发一次重新绘制
        this.#redraw();
    }

    // 私有颜色属性
    #__color__: Fillable = new RGBA(0, 0, 0);

// 获取颜色的方法
    get color() {
        return this.#__color__;
    }

// 设置颜色的方法，当对象属性变化时会触发重新创建和绘制文本元素
    set color(v: Fillable) {
        let that = this;

        if (v && typeof v === "object") {
            this.#__color__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__color__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    // 私有动画对象引用属性
    #__animation__: Animation;

// 获取动画对象的方法
    get animation() {
        return this.#__animation__;
    }

// 设置动画对象的方法，添加动画效果并根据动画状态触发相应的重新绘制操作
    set animation(v: Animation) {
        this.#__animation__ = v;
        if (!v) {
            this.#redraw("both");
            return;
        } else {
            this.#redraw("dynamic");
        }
        this.#__animation__.target.push(this);
        this.#__animation__.replay();
    }

// 获取适合当前图形渲染上下文的方法，根据动画状态决定使用静态还是动态canvas
    public getContext(canvas: Canvas): CanvasRenderingContext2D {
        // 遍历父级元素直到body节点，查找包含动画的对象
        for (let i: HTMLElement = this; i !== this.mano && i; i = i.parentElement) {
            let graphic: GraphicBase = i as GraphicBase;

            if (graphic.animation) {
                return canvas.dynamicsCanvas;
            }
        }
        return canvas.staticCanvas;
    }

    // 渲染当前图形元素到指定的canvas上。此方法首先触发一个"render"事件，并获取父级元素中的Mano对象。
    public render(this: GraphicBase, canvas: Canvas): CanvasRenderingContext2D;
    public render(this: GraphicBase, canvas: Canvas, clearOption?: "both" | "static" | "dynamic"): CanvasRenderingContext2D {
        // 创建并触发一个RenderEvent事件，表示开始渲染过程
        let ev = new RenderEvent("manorender");
        this.dispatchEvent(ev);

        // 获取父级元素的Mano对象引用
        this.mano = (this.parentElement as HTMLElement & { mano: Mano }).mano;

        // 根据动画状态或其他条件选择合适的canvas上下文并返回
        return this.getContext(canvas);
    }

// 渲染当前图形元素的所有子元素到指定的canvas上
    public renderChildren(canvas: Canvas) {
        // 遍历所有子元素并将它们转换为GraphicBase类型实例
        Array.from(this.children).forEach(element => {
            let graphic = element as GraphicBase;

            // 更新图形的边界矩形
            const boundingRect = graphic.getBoundingClientRect();

            // 如果图形的边界矩形超出了画布的范围，则跳过此图形
            if (boundingRect.x + boundingRect.width < 0 ||
                boundingRect.x > this.mano.canvas.canvasOptions.width ||
                boundingRect.y + boundingRect.height < 0 ||
                boundingRect.y > this.mano.canvas.canvasOptions.height) {
                return;
            }
            // 调用子元素的render方法进行渲染
            graphic.render(canvas);

            // 创建并触发一个AfterRenderEvent事件，表示子元素已完成渲染
            let ev = new AfterRenderEvent("manoafterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
    }

    // GraphicBase类的构造函数
    constructor() {
        // 调用父类构造函数以完成初始化
        super();
    }
}

export {GraphicBase}

