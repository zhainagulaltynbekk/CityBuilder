export default class PoliceDepartment {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.protected_buildings = 0;
    }

    get_radius() {
        return this.radius;
    }

    get_coordinates() {
        return { x: this.x, y: this.y, radius: this.radius };
    }
}