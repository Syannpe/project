function bezierCurve(ctrlPoint1X, ctrlPoint1Y, ctrlPoint2X, ctrlPoint2Y) {
    let cx1, cy1, cx2, cy2;
    cx1 = ctrlPoint1X;
    cy1 = ctrlPoint1Y;
    cx2 = ctrlPoint2X;
    cy2 = ctrlPoint2Y;
    // 控制点1，x 和 y 坐标不小于 0，不大于 1
    let controlPoint1X = Math.max(0, Math.min(1, cx1));
    let controlPoint1Y = Math.max(0, Math.min(1, cy1));
    // 控制点2，x 和 y 坐标不小于 0，不大于 1
    let controlPoint2X = Math.max(0, Math.min(1, cx2));
    let controlPoint2Y = Math.max(0, Math.min(1, cy2));
    controlPoint1Y = 1 - controlPoint1Y;
    controlPoint2Y = 1 - controlPoint2Y;
    return function (t) {
        if (t <= 0)
            return { x: 0, y: 0 };
        if (t >= 1)
            return { x: 1, y: 1 };
        const cX = 3 * controlPoint1X;
        const bX = 3 * (controlPoint2X - controlPoint1X) - cX;
        const aX = 1 - cX - bX;
        const cY = 3 * (controlPoint1Y - 1);
        const bY = 3 * (controlPoint2Y - controlPoint1Y) - cY;
        const aY = -1 - cY - bY;
        const rx = (aX * t ** 3) + (bX * t ** 2) + (cX * t);
        const ry = (aY * t ** 3) + (bY * t ** 2) + (cY * t);
        const x = Math.abs(rx);
        const y = Math.abs(ry);
        return { x, y };
    };
}
export { bezierCurve };
