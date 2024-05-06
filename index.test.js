const assert = require('assert');
const {getMoodLevelStage, findSourceImage, checkEmpty, FireDepartment, initialize} = require('./testFunctions.js');

describe('Mood function', () => {
  describe('getMoodLevelStage function', () => {
    it('should return "Normal"', () => {
      assert.strictEqual(getMoodLevelStage(50), "Normal");
    });
  });
  describe('getMoodLevelStage function', () => {
    it('should return "Bad"', () => {
      assert.strictEqual(getMoodLevelStage(6), "Bad");
    });
  });
  describe('checkEmpty() function', () => {
    it('should return true', () => {
      assert.strictEqual(checkEmpty(5,5), true);
    });
  });
  describe('checkEmpty() function out of bounds', () => {
    it('should return false', () => {
      assert.strictEqual(checkEmpty(0,0), false);
    });
  });
  describe('findSourceImage() function', () => {
    it('should return ""', () => {
      assert.strictEqual(findSourceImage(0,0,0), "");
    });
  });
  describe('findSourceImage() function', () => {
    it('should return "icons/kaganat!"', () => {
      assert.strictEqual(findSourceImage(8,8,5),"icons/kaganat!");
    });
  });
  // Functions for Fire department
  const f = new FireDepartment(6,1,1);
  let zones = [f];
  let grid = [
    [31,32,33,-1,-1, 0,0,0,1,0,0,0,0,0],
    [34,35,36, 0,-1,-1,-1,-1,-1,-1,-1,0,0,0],
    [37,38,39,-1, 0, 0, 0, 0, 1, 0, 0,0,0,0],
    [1,-1, 0, -1, 0,-1,-1, 1,-1, 0, 0,0,0,0],
    [1,-1,-1, -1,-1,-1, 0, 0, 1, 0, 0,1,0],
    [1,-1, 0,  0, 0, 0, 0, 0, 0, 0, 0,0,0,0],
    ];
  describe('Coordinates() function', () => {
    it('should return array of size 3. three possible roads to continue!', () => {
      assert.strictEqual(f.CoordsOfFireDept(zones, grid).length, 3);
    });
  });
  describe('Coordinates() function', () => {
    it('should return array of size 2. two possible roads to continue!', () => {
      grid[0][3] = 0;
      assert.strictEqual(f.CoordsOfFireDept(zones, grid).length, 2);
      grid[0][3] = -1;
    });
  });
  describe('Coordinates() function', () => {
    it('should return array of size 0 (No roads)', () => {
      grid[0][3] = 0;
      grid[2][3] = 0;
      grid[3][1] = 0;
      assert.strictEqual(f.CoordsOfFireDept(zones, grid).length, 0);
      grid[0][3] = -1;
      grid[2][3] = -1;
      grid[3][1] = -1;
    });
  });
  describe('Coordinates() function', () => {
    it('should return empty array(no Fire department)', () => {
      zones = [];
      assert.strictEqual(f.CoordsOfFireDept(zones, grid).length, 0);
      zones = [f];
    });
  });
  describe('Shortest path() function', () => {
    it('should return array of size 5 optimal way!', () => {
      assert.strictEqual(f.shortest_path(zones, grid, 3, 7).length, 5);
    });
  });
  describe('Shortest path() function', () => {
    it('should return array of size 7 optimal is 7', () => {
      grid[0][3] = 0;
      assert.strictEqual(f.shortest_path(zones, grid, 3, 8).length, 7);
      grid[0][3] = -1;
    });
  });
  describe('Shortest path() function', () => {
    it('should be 0 deleted Fire Department', () => {
      grid[0][3] = 0;
      zones = [];
      assert.strictEqual(f.shortest_path(zones, grid, 3, 8).length, 0);
      grid[0][3] = -1;
    });
  });
  describe('Shortest path() function', () => {
    it('should return array of size 0 (No road leading there)', () => {
      assert.strictEqual(f.shortest_path(zones, grid, 4, 11).length, 0);
    });
  });
  describe('Initialize() function', () => {
    it('grid[0][0]should be 0', () => {
      initialize(grid);
      assert.strictEqual(grid[50][50], 0);
    });
  });
});