class ContextChangeEvent extends Event {
    constructor() {
        super(...arguments);
        this.clearOptions = "both";
    }
}
export { ContextChangeEvent };
