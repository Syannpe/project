import {TextFormat} from "../Graphic/TextFormat.js";
import {Shadow} from "../Graphic/Shadow.js";
import {Border} from "../Graphic/Border.js";
import {Font} from "../Graphic/Font.js";
import {FILL_TYPE} from "../Graphic/FILL_TYPE.js";
import {FILL_RULE} from "../Graphic/FILL_RULE.js";
import {Fillable} from "../Fillable/Fillable.js";

interface GraphicKeyframe {
    offset?: number;
    textFormat?: TextFormat;
    boxShadow?: Shadow;
    textShadow?: Shadow;
    border?: Border;
    font?: Font;
    boxTransform?: DOMMatrixReadOnly;
    textTransform?: DOMMatrixReadOnly;
    fillType?: FILL_TYPE;
    fillRule?: FILL_RULE;
    backgroundColor?: Fillable;
    color?: Fillable;
}

export {GraphicKeyframe}