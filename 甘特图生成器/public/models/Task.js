/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
export default class Task {
    name;
    proportion;
    earlyStart;
    earlyEnd;
    lateStart;
    lateEnd;
    equation;
    static id = 0; //默认分配ID
    id;
    color; // 渲染颜色
    constructor(name, proportion, // 进度比例
    earlyStart, earlyEnd, lateStart, lateEnd, equation) {
        this.name = name;
        this.proportion = proportion;
        this.earlyStart = earlyStart;
        this.earlyEnd = earlyEnd;
        this.lateStart = lateStart;
        this.lateEnd = lateEnd;
        this.equation = equation;
        if (!this.lateStart)
            this.lateStart = this.earlyStart;
        if (!this.lateEnd)
            this.lateEnd = this.earlyEnd;
        this.id = ++Task.id;
        const r = Math.floor(Math.random() * 128) + 128;
        const g = Math.floor(Math.random() * 128) + 128;
        const b = Math.floor(Math.random() * 128) + 128;
        this.color = `rgb(${r}, ${g}, ${b})`;
    }
}
//# sourceMappingURL=Task.js.map