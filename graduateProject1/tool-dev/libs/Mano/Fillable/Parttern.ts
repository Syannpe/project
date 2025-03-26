import {ImageObject} from "./ImageObject.js";

class Parttern {
    public image: ImageObject;
    public repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"

    constructor(image: ImageObject, repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" = "no-repeat") {
        this.image = image;
        this.repetition = repetition;
    }
}

export {Parttern}

