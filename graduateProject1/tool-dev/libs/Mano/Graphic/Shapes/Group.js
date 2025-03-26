import { GraphicBase } from "../GraphicBase.js";
import { AfterRenderEvent } from "../../Event/AfterRenderEvent.js";
class Group extends GraphicBase {
    updateBoundingRect() {
        const x = 0;
        const y = 0;
        const width = 0;
        const height = 0;
        this.setBoundingClientRect({ x, y, width, height });
    }
    render(canvas, clearOption) {
        let crc = super.render(canvas);
        this.path = new Path2D();
        const that = this;
        Array.from(this.children).forEach(element => {
            let graphic = element;
            graphic.textFormat = graphic.textFormat || that.textFormat;
            graphic.boxShadow = graphic.boxShadow || that.boxShadow;
            graphic.textShadow = graphic.textShadow || that.textShadow;
            graphic.border = graphic.border || that.border;
            graphic.font = graphic.font || that.font;
            graphic.inheritBoxTransform = that.boxTransform;
            graphic.inheritTextTransform = that.textTransform;
            graphic.fillType = graphic.fillType || that.fillType;
            graphic.fillRule = graphic.fillRule || that.fillRule;
            graphic.backgroundColor = graphic.backgroundColor || that.backgroundColor;
            graphic.color = graphic.color || that.color;
            if (!(graphic instanceof Group) && graphic.getContext(canvas) === canvas.dynamicsCanvas && clearOption === "static") {
                return;
            }
            else if (!(graphic instanceof Group) && graphic.getContext(canvas) === canvas.staticCanvas && clearOption === "dynamic") {
                return;
            }
            graphic.updateBoundingRect();
            const boundingRect = graphic.getBoundingClientRect();
            if (boundingRect.x + boundingRect.width < 0 ||
                boundingRect.x > canvas.canvasOptions.width ||
                boundingRect.y + boundingRect.height < 0 ||
                boundingRect.y > canvas.canvasOptions.height) {
                return;
            }
            if (graphic instanceof Group) {
                graphic.render(canvas, clearOption);
            }
            else {
                graphic.render(canvas);
            }
            this.path.addPath(graphic.path);
            let ev = new AfterRenderEvent("manoafterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
        return null;
    }
    constructor() {
        super();
    }
}
customElements.define("mano-group", Group);
export { Group };
