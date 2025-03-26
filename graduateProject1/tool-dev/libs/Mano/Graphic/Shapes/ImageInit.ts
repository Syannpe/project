import {ImageObject} from "../../Fillable/ImageObject.js";

interface ImageInit {
    image: ImageObject,
    imageX?: number,
    imageY?: number,
    imageWidth?: number,
    imageHeight?: number,
    startX: number,
    startY: number,
    rectWidth?: number,
    rectHeight?: number,
}

export {ImageInit}