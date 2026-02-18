/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */

export default class Task {
    public static id: number = 0;       //默认分配ID

    public id: number;
    public color: string;           // 渲染颜色

    constructor(
        public name: string,
        public proportion: number | number[],     // 进度比例

        public earlyStart: Date,
        public earlyEnd: Date | number,
        public lateStart?: Date,
        public lateEnd?: Date | number,
        public equation?: (date: Date, dayNumber: number) => boolean
    ) {

        if (!this.lateStart) this.lateStart = this.earlyStart;
        if (!this.lateEnd) this.lateEnd = this.earlyEnd;

        this.id = ++Task.id;
        const r = Math.floor(Math.random() * 128) + 128;
        const g = Math.floor(Math.random() * 128) + 128;
        const b = Math.floor(Math.random() * 128) + 128;

        this.color = `rgb(${r}, ${g}, ${b})`;
    }
}