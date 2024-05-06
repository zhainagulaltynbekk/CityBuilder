export default class Industrial {
    constructor(type, x, y, capacity, workers, source, tax) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.capacity = capacity;
        this.workers = workers;
        this.source = source;
        this.tax = tax;
    }

    get_coordinates() {
        return { x: this.x, y: this.y };
    }
}