class Service {
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
}
  
export default Service;
  