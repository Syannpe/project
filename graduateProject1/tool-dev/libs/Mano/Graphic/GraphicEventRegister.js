import { FILL_TYPE } from "./FILL_TYPE.js";
import { GraphicBase } from "./GraphicBase.js";
/**
 * GraphicEventRegister 类用于管理图形元素的事件监听。
 * 继承自 HTMLElement，提供额外的事件管理功能，包括对鼠标事件的特殊处理。
 */
class GraphicEventRegister extends HTMLElement {
    /**
     * 添加事件监听器。
     * 对于特定类型的事件（以"mano"开头或eventType为"other"的事件），会直接使用super.addEventListener进行添加。
     * 其他类型的事件会被记录在mouseEvents数组中，用于后续的特殊处理。
     * @param type 事件类型。
     * @param listener 监听器函数。
     * @param options 事件监听选项。
     */
    addEventListener(type, listener, options) {
        //特殊处理的事件，例如自定义事件，运行时事件
        if (type.startsWith("mano")) {
            super.addEventListener(type, listener, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.eventType) === "other") {
            super.addEventListener(type, listener, options);
        }
        else {
            this.mouseEvents.push({ type, listener, options });
        }
    }
    /**
     * 移除事件监听器。
     * 对于特定类型的事件，会直接使用super.removeEventListener进行移除。
     * 其他类型的事件会从mouseEvents数组中移除，并同时使用super.removeEventListener移除对应的监听器。
     * @param type 事件类型。
     * @param listener 监听器函数。
     * @param options 事件监听选项。
     */
    removeEventListener(type, listener, options) {
        //特殊处理的事件，例如自定义事件，运行时事件
        if (type.startsWith("mano")) {
            super.removeEventListener(type, listener, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.eventType) === "other") {
            super.removeEventListener(type, listener, options);
        }
        else {
            let targetIndex = -1;
            for (let i = 0; i < this.mouseEvents.length; i++) {
                if (this.mouseEvents[i].type === type &&
                    this.mouseEvents[i].listener === listener &&
                    this.mouseEvents[i].options === options) {
                    targetIndex = i;
                }
            }
            if (targetIndex !== -1)
                this.mouseEvents.splice(targetIndex, 1);
            super.removeEventListener(type, listener, options);
        }
    }
    /**
     * 构造函数，初始化事件监听。
     * 绑定事件处理函数用于处理鼠标移动事件，以及在鼠标移动时根据图形元素是否被覆盖来动态添加或移除事件监听器。
     */
    constructor() {
        super();
        // 存储注册的鼠标事件
        this.mouseEvents = [];
        let that = this;
        let registEvOnParent = super.addEventListener.bind(this);
        let removeEvOnParent = super.removeEventListener.bind(this);
        let coveredEles = []; //考虑到所有和当前坐标相重合的元素，就是被当前元素覆盖的元素
        //因为会有多个元素同时触发事件，所以需要把每一个元素以及是否已经注册的标识储存起来
        //这个属性就是元素和是否已经注册事件的布尔值的键值对
        let registed = new Map();
        /**
         * 检查是否应该为当前元素注册事件监听器。
         * 根据鼠标位置和元素的填充类型来决定是否注册事件监听器。
         * 如果当前元素未注册且鼠标位于元素内部，则为该元素添加事件监听器。
         * 如果当前元素已注册且鼠标移出元素，则移除该元素的事件监听器。
         * @param this GraphicBase实例，事件源对象。
         * @param mousemoveEv 鼠标移动事件对象。
         * @param flag 标识是否是由其他元素递归调用。
         */
        //@param flag:判断是不是其他对象衍生的调用，防止无限循环
        function checkCB(mousemoveEv, flag) {
            let c = this.mano.canvas.staticCanvas;
            let boundingbox = c.canvas.getBoundingClientRect();
            let res;
            if (this.fillType === FILL_TYPE.GRAPHIC_FILL) {
                res = c.isPointInPath(this.path, mousemoveEv.x - boundingbox.x, mousemoveEv.y - boundingbox.y, this.fillRule);
            }
            else if (this.fillType === FILL_TYPE.GRAPHIC_STROKE) {
                res = c.isPointInStroke(this.path, mousemoveEv.x - boundingbox.x, mousemoveEv.y - boundingbox.y);
            }
            coveredEles = document.elementsFromPoint(mousemoveEv.x, mousemoveEv.y).filter(value => value instanceof GraphicBase);
            if (res && !registed.get(this)) {
                registed.set(this, true);
                this.mouseEvents.forEach(({ type, listener, options }, i, a) => {
                    //有类似于划入划出的立即触发事件
                    if (["mouseover", "mouseenter", "pointerenter", "pointerover"].indexOf(type) !== -1) {
                        listener.call(this, mousemoveEv);
                    }
                    registEvOnParent(type, listener, options);
                });
            }
            else if (!res && registed.get(this)) {
                registed.set(this, false);
                this.mouseEvents.forEach(({ type, listener, options }, i, a) => {
                    //有类似于划入划出的立即触发事件
                    if (["mouseleave", "mouseout", "pointerleave", "pointerout"].indexOf(type) !== -1) {
                        listener.call(this, mousemoveEv);
                    }
                    removeEvOnParent(type, listener, options);
                });
            }
            if (coveredEles.length !== 0 && !flag) {
                //为每一个被覆盖的元素同样声明事件
                coveredEles.forEach(ele => {
                    if (ele === this)
                        return;
                    checkCB.call(ele, mousemoveEv, true);
                });
            }
        }
        // 动态注册和移除mousemove事件监听，以处理图形元素的覆盖变化。
        registEvOnParent("mouseover", function (mouseoverEv) {
            registEvOnParent("mousemove", checkCB.bind(that));
        });
        registEvOnParent("mouseout", function (mouseoutEv) {
            removeEvOnParent("mousemove", checkCB.bind(that));
        });
    }
}
export { GraphicEventRegister };
