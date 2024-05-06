export default class School {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

    get_coordinates() {
        return { x: this.x, y: this.y };
    }

    
}