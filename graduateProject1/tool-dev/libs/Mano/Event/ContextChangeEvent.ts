class ContextChangeEvent extends Event {
    source: string;
    clearOptions: "both" | "static" | "dynamic" = "both"
}

export {ContextChangeEvent}