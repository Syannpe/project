/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

export default class Task {
    public color: string           // 渲染颜色

    constructor(
        public id: string,
        public name: string,
        public earlyStart: Date,
        public earlyEnd: Date | number,
        public lateStart: Date,
        public lateEnd: Date | number,
        public proportion: number|number[],     // 进度比例
        public equation: (date: Date, dayNumber: number) => boolean
    ) {
        const r = Math.floor(Math.random() * 128) + 128;
        const g = Math.floor(Math.random() * 128) + 128;
        const b = Math.floor(Math.random() * 128) + 128;

        this.color = `rgb(${r}, ${g}, ${b})`;
    }
}