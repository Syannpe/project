class GradientBase {
    constructor() {
        this.colorStops = [];
    }
    addColorStop(offset, color) {
        this.colorStops.push({ offset, color });
    }
    deleteColorStop(offset, color) {
        let index = -1;
        for (let i = 0; i < this.colorStops.length; i++) {
            if (this.colorStops[i].offset === offset &&
                this.colorStops[i].color === color) {
                index = i;
            }
        }
        if (index !== -1)
            this.colorStops.splice(index, 1);
    }
    updateColorStop(oldOffset, oldColor, newOffset, newColor) {
        let index = -1;
        for (let i = 0; i < this.colorStops.length; i++) {
            if (this.colorStops[i].offset === oldOffset &&
                this.colorStops[i].color === oldColor) {
                index = i;
            }
        }
        if (index !== -1) {
            this.colorStops[index].offset = newOffset;
            this.colorStops[index].color = newColor;
        }
    }
}
export { GradientBase };
