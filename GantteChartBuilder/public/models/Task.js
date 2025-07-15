/**
 * @version v1.0
 * @ClassNmae: DrawOptions
 * @Description: desc
 * @Author: SYANNPE
 */
export default class Task {
    id;
    name;
    earlyStart;
    earlyEnd;
    lateStart;
    lateEnd;
    proportion;
    equation;
    color; // 渲染颜色
    constructor(id, name, earlyStart, earlyEnd, lateStart, lateEnd, proportion, // 进度比例
    equation) {
        this.id = id;
        this.name = name;
        this.earlyStart = earlyStart;
        this.earlyEnd = earlyEnd;
        this.lateStart = lateStart;
        this.lateEnd = lateEnd;
        this.proportion = proportion;
        this.equation = equation;
        const r = Math.floor(Math.random() * 128) + 128;
        const g = Math.floor(Math.random() * 128) + 128;
        const b = Math.floor(Math.random() * 128) + 128;
        this.color = `rgb(${r}, ${g}, ${b})`;
    }
}
//# sourceMappingURL=Task.js.map