function linearFunction(p1, p2) {
    return function (t) {
        if (t < p1)
            return { x: t, y: 0 };
        if (t > p2)
            return { x: t, y: 1 };
        let k = 1 / (p2 - p1);
        let y = k * (t - p1);
        return { x: t, y };
    };
}
export { linearFunction };
