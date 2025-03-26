function steps(n: number,
               jumpterm: "jump-start" | "jump-end" | "jump-none" | "jump-both" | "start" | "end")
    : (t: number) => {
    x: number,
    y: number
} {
    let step = 1 / n;
    if (jumpterm === "jump-both") {
        step = 1 / (n + 1);
    } else if (jumpterm === "jump-none") {
        step = 1 / (n - 1);
    }
    return function (t: number): { x: number, y: number } {
        if (t <= 0) return {x: 0, y: 0}
        if (t >= 1) return {x: 1, y: 1}
        if (jumpterm === "jump-end" || jumpterm === "end") {
            let floor = Math.floor(t / step);   //当前时间除以step为目前时间应该在第几层
            return {x: t, y: Math.min(step * floor, 1)};
        } else if (jumpterm === "jump-start" || jumpterm === "start") {
            let floor = Math.ceil(t / step);   //当前时间除以step为目前时间应该在第几层
            return {x: t, y: Math.min(step * floor, 1)};
        } else if (jumpterm === "jump-both") {
            let floor = Math.ceil(t / (1 / n));   //当前时间除以step为目前时间应该在第几层
            return {x: t, y: Math.min(step * floor, 1)};
        } else if (jumpterm === "jump-none") {
            let floor = Math.floor(t / (1 / n));   //当前时间除以step为目前时间应该在第几层
            return {x: t, y: Math.min(step * floor, 1)};
        }
    }
}

export {steps}