import {Arc} from "./Shapes/Arc.js"
import {Arc2} from "./Shapes/Arc2.js"
import {Ellipse} from "./Shapes/Ellipse.js"
import {Line} from "./Shapes/Line.js"
import {BezierCurve} from "./Shapes/BezierCurve.js"
import {Rect} from "./Shapes/Rect.js"
import {RoundRect} from "./Shapes/RoundRect.js"
import {Text} from "./Shapes/Text.js"
import {Image} from "./Shapes/Image.js"
import {CustomGraphic} from "./Shapes/CustomGraphic.js"
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";
import {Mano} from "../Mano.js";
import {Group} from "./Shapes/Group.js"
import {GraphicBase} from "./GraphicBase.js"

class Graphic extends HTMLElement {
    public static Arc: typeof Arc = Arc;
    public static Arc2: typeof Arc2 = Arc2;
    public static Ellipse: typeof Ellipse = Ellipse;
    public static Line: typeof Line = Line;
    public static BezierCurve: typeof BezierCurve = BezierCurve;
    public static Rect: typeof Rect = Rect;
    public static RoundRect: typeof RoundRect = RoundRect;
    public static Text: typeof Text = Text;
    public static Group: typeof Group = Group;
    public static Image: typeof Image = Image;

    public static CustomGraphic: typeof CustomGraphic = CustomGraphic;

    public mano: Mano;

    public appendChild<T extends Node>(node: T): T {
        super.appendChild(node);
        if (!(node instanceof GraphicBase)) return null;

        //触发预备程序，在下一次屏幕刷新的时候更新
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        ev.source = "graphic"
        this.mano?.canvas?.dispatchEvent(ev);

        return node;
    }

    public removeChild<T extends Node>(child: T): T {
        super.removeChild(child);

        //触发预备程序，在下一次屏幕刷新的时候更新
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        this.mano?.canvas?.dispatchEvent(ev);

        return child;
    }

    constructor() {
        super();
        this.style.position = "absolute";
        this.style.zIndex = "1";
    }
}

customElements.define("mano-graphic", Graphic);

export {Graphic}

