export default class FireDepartment {
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
        }
        return res;
    }
}