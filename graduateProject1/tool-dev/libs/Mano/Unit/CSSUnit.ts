type CSSLengthValidUnit =
    "cap" | "ch" | "em" | "ex" | "ic" | "lh" |
    "rcap" | "rch" | "rem" | "rex" | "ric" | "rlh" |
    "dvh" | "dvw" | "lvh" | "lvw" | "svh" | "svw" |
    "vb" | "vh" | "vi" | "vmax" | "vmin" | "vw" |
    "cqb" | "cqh" | "cqi" | "cqmax" | "cqmin" | "cqw" |
    "cm" | "in" | "mm" | "pc" | "pt" | "px" | "Q";
type CSSLength = CSSUnitValue & { unit: CSSLengthValidUnit };

type CSSPercent = CSSUnitValue & { unit: "percent" };


type CSSAngleValidUnit = "deg" | "grad" | "rad" | "turn";
type CSSAngle = CSSUnitValue & { unit: CSSAngleValidUnit };

type CSSTimeValidUnit = "ms" | "s";
type CSSTime = CSSUnitValue & { unit: CSSTimeValidUnit };

export {CSSLength, CSSPercent, CSSAngle, CSSTime};