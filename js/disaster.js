class Disaster {
    constructor(x, y, type, dis_type, started) {
        this.x = x;
        this.y = y;
        this.type =  type;
        this.dis_type = dis_type;
        this.started = started;
    }
    
    get_coordinates() {
        return { x: this.x, y: this.y };
    }
    get_type(){
        return this.type;
    }
    get_prev_zonee(){
        return this.prev_zone;
    }
}

export default Disaster;