class Residential {
    constructor(type, x, y, capacity, workers, source) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.capacity = capacity;
        this.workers = workers;
        this.source = source;
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
let grid = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
let zones = [];
zones.push(new Residential(1,8,8,0,0,"icons/kaganat!"));
grid[8][8] = 5;
function getMoodLevelStage(moodLevel) {
    if (moodLevel == 0) {
      return "People hate you!";
    }else if (moodLevel >= 1 && moodLevel <= 35) {
      return "Bad";
    } else if (moodLevel >= 36 && moodLevel <= 60) {
      return "Normal";
    } else if (moodLevel >= 61 && moodLevel <= 80) {
      return "Good";
    } else if (moodLevel >= 81 && moodLevel <= 95) {
      return "Super";
    } else if (moodLevel >= 96 && moodLevel <= 100) {
      return "We love you, Mayor!";
    }
    return "";
  }

function checkEmpty(x, y) {
    if (x > 0 && x < 10 && y > 0 && y < 10) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (grid[i][j] != 0) {
                    return false;
                }
            }
        }
    }else {
        return false;
    }
    return true;
}
function findSourceImage(x, y, num) {
    num = num % 10;
    // xx, yy will be the center x,y coordinates of a class
    // which were saved inside of our classes in zones array.
    let xx = x;
    let yy = y;
    if (num == 1 || num == 2 || num == 3) {
        yy = y - (num - 2);
        xx = x + 1;
    }else if (num == 4 || num == 5 || num == 6) {
        yy = y - (num - 5);
    }else {
        yy = y - (num - 8);
        xx = x - 1;
    }
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].x == xx && zones[i].y == yy) {
            return zones[i].source;
        }
    }
    return "";
}

// Fire dept
class FireDepartment {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

    get_coordinates() {
        return { x: this.x, y: this.y };
    }
    shortest_path(zones, grid, dest_x, dest_y) {
        const coordinates = this.CoordsOfFireDept(zones, grid);
        let queue = [];
        let visited = new Set();
        for (const [x, y] of coordinates) {
            visited.add(`${x},${y}`);
            queue.push([x, y, [[x, y, -4]]]);
        }
        while (queue.length > 0) {
            const [x, y, coords] = queue.shift();
            const directions = [
                [-2, 0], [2, 0], [0, -2], [0, 2], // Up, down, left, right
                [-2,-1], [-2,1], // upper left, upper right, 
                [2,-1], [2,1],   // lower left, lower right
                [-1,-2], [1,-2], // lefter up, lefter down 
                [-1,2], [1,2]];  // righter up, righter down
            for (const [dx, dy] of directions) {
                if (x + dx >= 0 && x + dx < grid.length && y + dy >= 0 && y + dy < grid[0].length && x + dx == dest_x && y + dy == dest_y) {
                    return coords;
                }
            }
            if (y + 1 < grid[0].length && grid[x][y + 1] == -1 && !visited.has(`${x},${y + 1}`)) {
                visited.add(`${x},${y + 1}`);
                queue.push([x, y + 1, coords.concat([[x, y + 1, -4]])]);
            }
            if (y - 1 >= 0 && grid[x][y - 1] == -1 && !visited.has(`${x},${y - 1}`)) {
                visited.add(`${x},${y - 1}`);
                queue.push([x, y - 1, coords.concat([[x, y - 1, -6]])]);
            }
            if (x + 1 < grid.length && grid[x + 1][y] == -1 && !visited.has(`${x + 1},${y}`)) {
                visited.add(`${x + 1},${y}`);
                queue.push([x + 1, y, coords.concat([[x + 1, y, -5]])]);
            }
            if (x - 1 >= 0 && grid[x - 1][y] == -1 && !visited.has(`${x - 1},${y}`)) {
                visited.add(`${x - 1},${y}`);
                queue.push([x - 1, y, coords.concat([[x - 1, y, -3]])]);
            }
        }
        return [];
    }
    CoordsOfFireDept(zones, grid) {
        let res = [];
        for (const e of zones) {
            if (e.type == 6) {
                // Check 12 sides of it to find a road!
                const x = e.x;
                const y = e.y;
                // middle upper part;
                const directions = [
                    [-2, 0], [2, 0], [0, -2], [0, 2], // Up, down, left, right
                    [-2,-1], [-2,1], // upper left, upper right, 
                    [2,-1], [2,1],   // lower left, lower right
                    [-1,-2], [1,-2], // lefter up, lefter down 
                    [-1,2], [1,2]];  // righter up, righter down
                    for (const [dx, dy] of directions) {
                        if (x + dx >= 0 && x + dx < grid.length && y + dy >= 0 && y + dy < grid[0].length
                            && grid[x + dx][y + dy] == -1) {
                        // returns array of fireDept object, and 2 variables of road: x, y
                        res.push([x + dx, y + dy]);
                    }
                }
            }
        };
        return res;
    }
}
function initialize(grid) {
    for (let i = 0; i < 100; i++) {
        grid[i] = [];
        for (let j = 0; j < 120; j++) {
            grid[i][j] = 0;
        }
    }
}
module.exports = {getMoodLevelStage, checkEmpty, findSourceImage, FireDepartment, initialize};