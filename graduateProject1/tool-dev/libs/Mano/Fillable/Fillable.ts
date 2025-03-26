///<reference path="./Color.ts" />
///<reference path="./Gradient.ts" />
///<reference path="./Parttern.ts" />
import {ColorBase} from "./ColorBase.js";
import {Parttern} from "./Parttern.js";
import {GradientBase} from "./GradientBase.js";

type Fillable = ColorBase | GradientBase | Parttern;

export {Fillable}
