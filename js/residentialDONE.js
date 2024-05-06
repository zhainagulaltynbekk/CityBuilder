class Residential {
    constructor(type, x, y, capacity, workers, unemployed, source, tax) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.capacity = capacity;
        this.workers = workers;
        this.unemployed = unemployed;
        this.source = source;
        this.tax = tax;
        this.service_buildings_cnt = 0;
        this.industrial_buildings_cnt = 0;
        this.radius = 10;
    }
    
    get_coordinates() {
        return { x: this.x, y: this.y , radius: this.radius};
    }
    get_capacity() {
        return this.capacity;
    }
    get_source() {
        return this.source;
    }
    get_population(){
        return this.population;
    }
    
    set_capacity(capacity) {
        this.capacity = capacity;
    }
    set_source(source) {
        this.source = source;
    }
    set_population(population){
        this.population = population;
    }

    get_radius() {
        return this.radius;
    }
}
  
export default Residential;
  