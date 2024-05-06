import FireDepartment from "./js/fireDept.js";
import PoliceDepartment from "./js/policeDept.js";
import Industrial from "./js/industrial.js";
import Stadium from "./js/stadium.js";
import Service from "./js/service.js";
import School from "./js/school.js";
import University from "./js/university.js";
import Residential from "./js/residential.js";
import Person from "./js/person.js";
import { get_buildings_in_radius } from "./js/area_func.js";
// import Disaster from "./js/disaster.js";
import Disaster from "./js/disaster.js";
// import { Disaster_mode } from './js/disaster.js';
// localStorage.clear();

// Components
const start = document.querySelector("#start");
const playGround = document.querySelector(".edit");
const rectangle = document.querySelector("#rect");
// Buttons
const residential_btn = document.querySelector("#residential-btn");
const service_btn = document.querySelector("#service-btn");
const industrial_btn = document.querySelector("#industrial-btn");
const road_btn = document.querySelector("#road-btn");
const demolish_btn = document.querySelector('#demolish-btn');
const income_expences = document.querySelector('#income-expences');
const fire_station_btn = document.querySelector("#fire-station-btn");
const police_station_btn = document.querySelector("#police-station-btn");
const stadium_btn = document.querySelector("#stadium-btn");
const disaster_btn = document.querySelector('#disaster-btn');
const school_btn = document.querySelector('#school-btn');
const university_btn = document.querySelector('#university-btn');
const tax_inp = document.querySelector("#tax");
const pause_btn = document.querySelector("#pause");

// modal body to show income & expences:
const modal_income_exp = document.querySelector(".modal-body");
const budget = document.querySelector("#money");

// modal for right click part
const modal_info = document.querySelector("#rightClickInfo");

// Zones in array
let zones = [];
let disasters = [];

let intervalId;
let income = 0;
let expences = 0;
let money = 20000;
let population = 0;
let people = [];
let working_population = 0;
let moodLevel = 50;
let tax = 5;
let paused = false;
let user;
let speed = 2;
var secs = 0;
let time;

// Our matrix
let grid = []
let zoneType = -1;

/** Structure to store the game settings */
let Game = {
    board: grid,
    name: user,
    time: secs,
    speed : speed,
    zones : zones,
    income : income,
    expences : expences,
    money : money,
    population : population,
    mood : moodLevel,
    tax : tax,
    disasters : disasters,
    working_population : working_population,
}
// restart.addEventListener('click', function (e) {
//     location.reload();
// });

// hover functions
playGround.addEventListener('mouseover', function(e) {
    const {x, y} = xyCoordinate(e.target);
    if (zoneType == 3 || zoneType == 4) {
        rectangle.style.width = "20px";
        rectangle.style.height = "20px";
        rectangle.style.left = y * 20 + 175 + 'px';
        rectangle.style.top = x * 20 + 90 + 'px';
    }else {
        if (x > 0 && x < 99 && y > 0 && y < 119) {
            rectangle.style.left = y * 20 + 155 + 'px';
            rectangle.style.top = x * 20 + 70 + 'px';
        }
    }
});

// Click functions
playGround.addEventListener("click", function(e) {
    const {x, y} = xyCoordinate(e.target);
    if (zoneType == 3 && grid[x][y] == 0) {
        // road part
        grid[x][y] = -1;
        money -= 10;
        expences += 10;
        genTable(grid);
    }else if (zoneType == 4) {
        demolish(x, y);
        genTable(grid);
    }else if (checkEmpty(x, y)) {
        if (zoneType == 1 || zoneType == 2 || zoneType == 5) {
            money -= 100;
            expences += 100;
        }
        // TODO: other zonetypes to substract from our budget
        assign(zoneType, x, y);
        genTable(grid);
    }
    switch(zoneType){
        case 6:
        case 7:
            money -= 500;
            expences += 500;
            break;
        case 8:
            money -= 5000;
            expences += 5000;
            break;
        case 9:
            money -= 200;
            expences += 200;
            break;
        case 10:
            money -= 600;
            expences += 600;
            break;
        default:
            break;      
    }
});

//counters of service and industrial buildings
let service_builds_cnt = 0;
let industrial_builds_cnt = 0;
let industrial_near = 0;
let service_near = 0;
let protected_builds = 0;
let citizen_buildings_cnt = 0;
let universities = 0;

start.addEventListener("click", function (e) {
    //Zones in array
    zones = [];
    service_builds_cnt = 0;
    industrial_builds_cnt = 0;
    industrial_near = 0;
    service_near = 0;
    protected_builds = 0;
    citizen_buildings_cnt = 0;
    universities = 0;
    income = 0;
    expences = 0;
    money = 20000;
    population = 0;
    people = [];
    working_population = 0;
    moodLevel = 50;
    tax = 5;


    speed = 2;
    secs = 0;
    clearInterval(time);
    // Our matrix
    let grid = []
    let zoneType = -1;
    initialize();
    // console.log("here\n");
    genTable();
    time = setInterval(count, 1000);
    
    //start buttons renames to restart
    start.innerHTML = "Restart";
});


// Clicks on buttons zones part
residential_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "green";
    zoneType = 1;
    // budget changes
});
service_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "blue";
    zoneType = 2;
});
road_btn.addEventListener("click", function (e) {
    rectangle.style.width = "20px";
    rectangle.style.height = "20px";
    rectangle.style.borderColor = "black";
    zoneType = 3;
});
demolish_btn.addEventListener("click", function (e) {
    rectangle.style.width = "20px";
    rectangle.style.height = "20px";
    rectangle.style.borderColor = "cyan";
    zoneType = 4;
});
industrial_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "orange";
    zoneType = 5;
});
fire_station_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "red";
    zoneType = 6;
});
police_station_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "blue";
    zoneType = 7;
});
stadium_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "purple";
    zoneType = 8;
});
school_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "beige";
    zoneType = 9;
});
university_btn.addEventListener("click", function (e) {
    rectangle.style.width = "60px";
    rectangle.style.height = "60px";
    rectangle.style.borderColor = "turquoise";
    zoneType = 10;
});
disaster_btn.addEventListener("click", function (e) {
    Disaster_mode();
});


// Disaster mode

function Disaster_mode(){
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.width = '400px'; 
    popup.style.height = '80px';

    /** Fire */
    const fireBtn = document.createElement('button');
    fireBtn.textContent = 'Fire';
    fireBtn.style.marginRight = '10px';
    let classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    fireBtn.classList.add(...classes);

    fireBtn.addEventListener('click', function() {
        let found = true;
        let zn = Math.floor(Math.random() * zones.length);
        while(found){
            
            zn = Math.floor(Math.random() * zones.length);
            let ffound = false;
            for(let i = Math.max(0, zones[zn].x - 10); i <= Math.min(99, zones[zn].x + 10); i++){
               for(let j = Math.max(0, zones[zn].y - 10); j <= Math.min(119, zones[zn].y + 10); j++){
                    if(grid[i][j] >= 31 && grid[i][j] <= 40){
                        ffound = true;
                        break;
                    }
                }
            }
            found = ffound;

        // let x = Math.floor(Math.random() * 195);
        // let y = Math.floor(Math.random() * 95);
        // for(let i = x; i <= x + 3; x++){
            //     for(let j = y; j <= y + 3; j++){
                //         grid[i][j] = -100;
                //     }
                // }
        }
        disasters.push(new Disaster(zones[zn].x, zones[zn].y, 11, 1, secs));
        assign(11, zones[zn].x, zones[zn].y);
        popup.remove();
    });
    /**Tornado */
    const tornadoBtn = document.createElement('button');
    tornadoBtn.textContent = 'Tornado';
    tornadoBtn.style.marginRight = '10px';

    classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    tornadoBtn.classList.add(...classes);

    tornadoBtn.addEventListener('click', function() {
        let x = Math.floor(Math.random() * 95);
        let y = Math.floor(Math.random() * 115);
        console.log('Tornado');
        
        zoneType = 12;
        disasters.push(new Disaster(x, y, 12, 2, secs));
        assign(zoneType, x, y);

        popup.remove();
    });
    /**Cancel */
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    cancelBtn.classList.add(...classes);

    cancelBtn.addEventListener('click', function() {
        popup.remove();
    });

    popup.appendChild(fireBtn);
    popup.appendChild(tornadoBtn);
    popup.appendChild(cancelBtn);
    document.body.appendChild(popup);
}

// Clicks on buttons top part
income_expences.addEventListener("click", function (e) {
   modal_income_exp.innerHTML = "Population: " + Math.trunc(population) +  "<br>Income: " + income + "<br> Expences: " + expences;
});

// Right click on certain zone!
playGround.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    const {x, y} = xyCoordinate(e.target);
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].x == x && zones[i].y == y) {
            if (zones[i].type == 5 || zones[i].type == 2) {
                console.log("tax: " + zones[i].tax);
                if (tax_inp.value.length != 0) {
                    zones[i].tax = tax_inp.value;
                }
                const modalInfo = document.querySelector('#modalInfo');
                modalInfo.innerHTML = "Capacity: " + zones[i].capacity + "<br>" + "Workers: " + zones[i].workers;
                $(modal_info).modal('show');
            }else if (zones[i].type == 1) {
                console.log("tax: " + zones[i].tax);
                if (tax_inp.value.length != 0) {
                    zones[i].tax = tax_inp.value;
                }
                const modalInfo = document.querySelector('#modalInfo');
                modalInfo.innerHTML = "Capacity: " + zones[i].capacity + "<br>" + "Tenant/Owners: " + zones[i].workers;
                $(modal_info).modal('show');
            } // TODO Modal messages for other types of zones!
        }
    }
});

// Helper
function xyCoordinate(td) {
    const y = td.cellIndex;
    const tr = td.parentNode;
    const x = tr.sectionRowIndex;
    return {x, y};
}
function checkEmpty(x, y) {
    if (x > 0 && x < 99 && y > 0 && y < 119) {
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



function assign(type, x, y) {
    switch (type) {
        // residential
        case 1:
            type = 1;
            let initial_population = 10;
            let _unemployed = 0;
            if(population < 1000){
                initial_population = 40;
                // _unemployed = 40;
            }
            population += initial_population;
            let respeople = [];
            for(let j = 1; j <= initial_population; j++){
                let pers = new Person("normal")
                people.push(pers);
            }
            zones.push(new Residential(1, x, y, 100, initial_population, initial_population, "icons/residential_zone.png", 0));
            citizen_buildings_cnt++
            // console.log(typeof zones[0].unemployed);
            break;
        // service
        case 2:
            type = 11;
            zones.push(new Service(2, x, y, 100, 0, "icons/service_zone.png", 0));
            service_builds_cnt++
            citizen_buildings_cnt++
            break;
        // industrial
        case 5:
            type = 21;
            zones.push(new Industrial(5, x, y, 100, 0, 'icons/industrial_zone.png', 0));
            industrial_builds_cnt++
            citizen_buildings_cnt++
            break;
        // fire department
        case 6:
            type = 31;
            zones.push(new FireDepartment(6, x, y));
            citizen_buildings_cnt++
            break;
        //Police Department
        case 7:
            type = 41;
            zones.push(new PoliceDepartment(7, x, y));
            break;
        //Stadium
        case 8:
            type = 51;
            zones.push(new Stadium(8, x, y));
            citizen_buildings_cnt++
            break;
        case 9:
            type = 61;
            zones.push(new School(9, x, y));
            citizen_buildings_cnt++
            break;
        case 10:
            type = 71;
            zones.push(new University(10, x, y));
            citizen_buildings_cnt++
            universities++
            break;
        case 11:
            type = 100;
            break;
        case 12:
            type = 201;
            break;
        case 13:
            type = -100;
            break;
        // to be contiued
        default:
            break;
    }

//to see what is the difference in quantity of servie and industrial buildings
    
    if(type == 100 || type == -100){
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                grid[i][j] += type;
            }
        }
    }else{   
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                grid[i][j] = type;
                type++;
            }
        }
    }

    // Checking how many buildings are close to residental ones and buildings that are protected by police departments
    const ret = get_buildings_in_radius(zones, [Service, Industrial], Residential)
    const prot = get_buildings_in_radius(zones, [Object], PoliceDepartment)

    industrial_near = ret.counts[5] // industrial buildings close to residential
    service_near = ret.counts[2] // service  buildings close to residential
    protected_builds = prot.buildings.length // buildings protected by police deptartments
}

// Demolish part
// 1 2 3
// 4 5 6  => to make them all 0
// 7 8 9 
function demolish(x, y) {
    let num = grid[x][y];
    if (num == 0) {
        return;
    }
    if (num == -1) {
        money -= 20;
        grid[x][y] = 0;
        return;
    }
    num = num % 10;
    let xx = x;
    let yy = y;
    // console.log(num);
    if (num == 1 || num == 2 || num == 3) {
        yy = y - (num - 1);
    }else if (num == 4 || num == 5 || num == 6) {
        yy = y - (num - 4);
        xx = x - 1;
    }else {
        yy = y - (num - 7);
        xx = x - 2;
    }
    for (let i = xx; i <= xx + 2; i++) {
        for (let j = yy; j <= yy + 2; j++) {
            grid[i][j] = 0;
        }
    }
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].x == xx + 1 && zones[i].y == yy + 1) {
            if(zones[i].type == 1){
                population -= zones[i].workers;
            }
            money += 50;
            zones.splice(i, 1);
        }
    }
}

// HTML generator
function genTable() {
    let s = '';
    // console.log(grid);
    for (let i = 0; i < grid.length; i++) {
        s += '<tr>';
        for (let j = 0; j < grid[i].length; j++) {
            s +='<td' + setBackground(i, j, grid[i][j]) + '></td>';
        }
        s += '</tr>';
    }
    playGround.innerHTML = s;
}

// algorithm for finding the connected buildings
function bfs(zone) {
    
    const queue = [];
    const visited = new Set();
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, down, left, right
    const type = zone.type;
    const results = [];

    for(let xx = zone.x - 1; xx <= zone.x + 1; xx++){
        for(let yy = zone.y - 1; yy <= zone.y + 1; yy++){
            if (xx < 0 || yy < 0 || xx >= grid.length || yy >= grid[0].length) {
                continue;
            }
            queue.push([xx, yy, 0]);
        }
    }

    visited.add(`${zone.x},${zone.y}`);
  
    while (queue.length > 0) {
        const [x, y, distance] = queue.shift();
        let num = grid[x][y];
        if (type == 1 && ((num >= 11 && num <= 20 )|| (num >= 21 && num <= 30) ) ) {
            results.push( {x, y, distance} );
        }else if(type != 1 && num >= 1 && num <= 10){
            results.push( {x, y, distance} );
        }

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX < 0 || newY < 0 || newX >= grid.length || newY >= grid[0].length || visited.has(`${newX},${newY}`)) {
                continue;
            }

            if (grid[newX][newY] === 0) {
                continue;
            }
            queue.push([newX, newY, distance + 1]);
            visited.add(`${newX},${newY}`);
        }
    }
  
    return results; 
  }
  

// Hiring function!
function hire() {
    for (let i = 0; i < zones.length; i++) {
        
        let result = bfs(zones[i]);
        if( result.length > 0 && zones[i].type == 1 ){
            console.log(zones[i]);
            let left = 0;
            let mood = getMoodLevelStage();
            let initial_unemployed = zones[i].unemployed;
            switch (mood) {
                case "Bad":
                    left = parseInt(zones[i].workers * 0.05);
                    population -= parseInt(zones[i].workers * 0.05);
                    zones[i].workers -= parseInt(zones[i].workers * 0.05);
                    break;
                case "Normal":
                    initial_unemployed += parseInt(zones[i].workers * 0.05);
                    population += parseInt(zones[i].workers * 0.05);
                    zones[i].workers += parseInt(zones[i].workers * 0.05);
                    break;
                case "Good":
                    initial_unemployed += parseInt(zones[i].workers * 0.1);
                    population += parseInt(zones[i].workers * 0.1);
                    zones[i].workers += parseInt(zones[i].workers * 0.1);
                    break;
                case "Super":
                    initial_unemployed += parseInt(zones[i].workers * 0.15);
                    population += parseInt(zones[i].workers * 0.15);
                    zones[i].workers += parseInt(zones[i].workers * 0.15);
                    break;
                default:
                    break;
            }
            if(zones[i].workers > zones[i].capacity){
                zones[i].unemployed = initial_unemployed - (zones[i].workers - zones[i].capacity);
                population -= (zones[i].workers - zones[i].capacity);
                zones[i].workers = zones[i].capacity;
            }else{
                zones[i].unemployed = initial_unemployed;
            }
            if(zones[i].workers < 0){
                zones[i].workers = 0;
            }
            let not_working_people = population - working_population;
            // Population growth;
            let found = false;
            for(let k = 0; k < result.length; k++){
                if(found) break;
                for(let j = 0; j < zones.length; j++){
                    console.log("1 " + zones[j].workers);
                    if(Math.abs(zones[j].x - result[k].x) <= 1 && Math.abs(zones[j].y - result[k].y) <= 1){
                        let space = zones[j].capacity - zones[j].workers;
                        console.log(zones[i].unemployed);
                        if(space >= zones[i].unemployed){
                            
                            console.log(zones[j].type);
                            zones[j].workers += zones[i].unemployed;
                            working_population += zones[i].unemployed;
                            zones[i].unemployed = 0;
                            found = true;
                            break;
                        }else{
                            zones[i].unemployed -= space;
                            zones[j].workers = zones[j].capacity;
                        }
                    }
                }
            }
        }
    }

    // buildings will appear according to the quantity of citizens of in the zone
    // 0 people -> no building
    // 1 - half of capacity -> small building
    // 50 - full capacity -> big building
    // changing the inage if we reach half of the capacity
    for (let i = 0; i < zones.length; i++) {
        switch (zones[i].type) {
            case 5:
                if (zones[i].capacity / 2 <= zones[i].workers) {
                    zones[i].source = 'icons/industrial_build_update.png';
                }else if(zones[i].workers > 0){
                    zones[i].source = 'icons/industrial_build.png';
                }else{
                    zones[i].source = 'icons/industrial_zone.png';
                }
                break;
            case 2:
                if (zones[i].capacity / 2 <= zones[i].workers) {
                    zones[i].source = 'icons/service_build_update.png';
                }else if(zones[i].workers > 0){
                    zones[i].source = 'icons/service_build.png';
                }else {
                    zones[i].source = 'icons/service_zone.png';
                }
                break;
            case 1:
                if (zones[i].capacity / 2 <= zones[i].workers) {
                    zones[i].source = 'icons/residential_build_update.png';
                }else if(zones[i].workers > 0){
                    zones[i].source = 'icons/residential_build.png';
                }else {
                    zones[i].source = 'icons/residential_zone.png';
                }
                break;
            default:
                break;
        }
    }
}
                
// Add somethings to menu, restart
function initialize() {
    for (let i = 0; i < 100; i++) {
        grid[i] = [];
        for (let j = 0; j < 120; j++) {
            grid[i][j] = 0;
        }
    }
}

// giving every cell it's background image
// 1-9 => residential zone
// 11-19 => commercial zone 
// 21-29 => industrial zone
// 31-39 => fire station zone ... etc
// every cell will contains it's own part of image that's one of the 9
function setBackground(x, y, num) {
    if (num == 0) {
        return ' style="background-color: #9fef6a"';
    }
    if (num == -1) {
        return ' style="background-color: #545454"';
    }
    let s = " style=";
    let mul1 = "-40";
    let mul2 = "-40";
    if (num >= 1 && num <= 9) {
        s += "\"background-image: url('" + findSourceImage(x, y, num) + "');";
    }else if (num >= 11 && num <= 19) {
        s += "\"background-image: url('" + findSourceImage(x, y, num) + "');";
    }else if (num >= 21 && num <= 29) {
        s += "\"background-image: url('" + findSourceImage(x, y, num) + "');";
    }else if (num >= 31 && num <= 39) {
        s += "\"background-image: url('icons/fire_dept.png');";
    }else if (num >= 41 && num <= 49) {
        s += "\"background-image: url('icons/police_dept.png');";
    }else if (num >= 51 && num <= 59) {
        s += "\"background-image: url('icons/stadium.png');";
    }else if (num >= 61 && num <= 69) {
        s += "\"background-image: url('icons/school.png');";
    }else if (num >= 71 && num <= 79) {
        s += "\"background-image: url('icons/university.png');";
    }else if (num == -3) { // up fire department
        s += "\"background-image: url('icons/up.png');";
    }else if (num == -4) { // right fire department
        s += "\"background-image: url('icons/right.png');";
    }else if (num == -5) { // down fire department
        s += "\"background-image: url('icons/down.png');";
    }else if (num == -6) { // left fire department
        s += "\"background-image: url('icons/left.png');";
    }else if (num >= 100 && num < 200){
        s += "\"background-image: url('icons/flames.png');";
    }else if(num >= 201 && num <= 220 ){
        s += "\"background-image: url('icons/tornado.png');";
    }
    // to be continued....(image types!)
    let oldnum = num;
    num %= 10;
    if (num == 0 || num == 1) {
        s += " background-position:0 0;\"";
    }else {
        if (num >= 1 && num <= 3) {
            mul1 = "0";
        }else if (num >= 4 && num <= 6) {
            mul1 = "-20";
        }
        if (num == 1 || num == 4 || num == 7) {
            mul2 = "0";
        }else if (num == 2 || num == 5 || num == 8) {
            mul2 = "-20";
        }
        s += " background-position:" + mul2 + "px " + mul1 + "px;\"";
    }
    return s;
}

// Satisfaction level

let satisfactionLevel = document.getElementById("satisfaction")

function moodLevelChange(){
    let disbalance_of_buildings = Math.abs(service_builds_cnt - industrial_builds_cnt)
    let percents_of_protected = Math.trunc((100 * protected_builds) / citizen_buildings_cnt)
    
    //mood changes in a negative way if there are too much industrial buildings or positively if service ones
    if (industrial_near - service_near > 0) moodLevel -= 1
    if(industrial_near > service_near + 4 && industrial_near > service_near + 6) moodLevel -= 2
    if(industrial_near > service_near + 7) moodLevel -= 3
    if(service_near - industrial_near > 0 && service_near - industrial_near > 2) moodLevel += 1
    if(service_near > industrial_near + 3 && service_near > industrial_near + 5) moodLevel += 2
    if(service_near > industrial_near + 6) moodLevel += 3

    //mood changes in negative way if there is a disbalance in service and industrial buildings
    if(disbalance_of_buildings > 3 && 5 < disbalance_of_buildings) moodLevel -= 1
    if(disbalance_of_buildings > 6 && 11 < disbalance_of_buildings) moodLevel -= 2
    if(disbalance_of_buildings > 12) moodLevel -= 3

    //mood changes according to protected buildings percentage 
    if(citizen_buildings_cnt > 5 && percents_of_protected == 0) moodLevel -= 1;
    if(0 < percents_of_protected && percents_of_protected > 35) moodLevel -= 1;
    if(36 < percents_of_protected && percents_of_protected > 50) moodLevel += 1;
    if(51 < percents_of_protected && percents_of_protected > 85) moodLevel += 2;
    if(86 < percents_of_protected && percents_of_protected > 100) moodLevel += 3;

    //mood changes negatuvely if the budget is too low
    if(money < 0) moodLevel -= 1
    if(money < -5000) moodLevel -= 1
    if(money < -10000) moodLevel -= 1

    //mood changes according to taxes
    if(tax <= 5 && zones.length > 2) moodLevel += 1
    if(tax > 5 && 8 > tax) moodLevel -= 1
    if(tax >= 8 && 11 > tax) moodLevel -= 2
    if(tax >= 11 && 14 > tax) moodLevel -= 3
    if(tax >= 14 && 20 > tax) moodLevel -= 4
    if(tax >= 20 && 30 > tax) moodLevel -= 5
    if(tax >= 30 && 50 > tax) moodLevel -= 6
    if(tax >= 50 && 80 > tax) moodLevel -= 7
    if(tax >= 80 && 100 > tax) moodLevel -= 8

    if(moodLevel < 0) moodLevel = 0
    if(moodLevel > 100) moodLevel = 100
}

/** Getting the mood level */

function getMoodLevelStage() {
    if (moodLevel == 0) {
      return "People hate you!"
    }else if (moodLevel >= 1 && moodLevel <= 35) {
      return "Bad"
    } else if (moodLevel >= 36 && moodLevel <= 60) {
      return "Normal"
    } else if (moodLevel >= 61 && moodLevel <= 80) {
      return "Good"
    } else if (moodLevel >= 81 && moodLevel <= 95) {
      return "Super"
    } else if (moodLevel >= 96 && moodLevel <= 100) {
      return "Beloved one!"
    }
}

/** Population growth */ 

function population_change() {
    let mood = getMoodLevelStage();
    switch (mood) {
        case "People hate you!":
            population -= population * 0.02;
            break;
        case "Bad":
            population -= population * 0.005;
            break;
        case "Normal":
            population += population * 0.005;
            break;
        case "Good":
            population += population * 0.01;
            break;
        case "Super":
            population += population * 0.015;
            break;
        case "Beloved one!":
            population += population * 0.02;
            break;
        default:
            break;
    }
}

let qualified_people = 0



// clearing the field after disaster

function clearfield(x, y){
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            grid[i][j] = 0;
        }
    }
}


async function fire_extinguish(dest_x, dest_y) {
    const temp = new FireDepartment(6,-1,-1);
    const road = temp.shortest_path(zones, grid, dest_x, dest_y);
    if (road.length == 0) {
        return false;
    }
    //hasRoads = true;
    for (const [x, y, n] of road) {
        grid[x][y] = n;
        genTable();
        await new Promise(resolve => setTimeout(resolve, 100));
        grid[x][y] = -1;
    }
    genTable();
    return true;
}
    

/**timer */
function timer(){}
var date = document.getElementById("date");
var sm = document.getElementById("sm");
async function count() {
    //following function changes population according to mood only and does not check residental zones accessibility

  secs = secs + speed;
  // budget:
  budget.innerHTML = "Budget: " + money + "$";
  if (secs % 112 >= 20 && secs % 112 <= 25 || secs % 112 >= 90 && secs % 112 <= 94) {
    hire();
    if(universities == 1 && population > 500) qualified_people = 150;
    if(universities > 1 && universities <= 3 && population > 999) qualified_people= 300;
    if(universities > 3 && universities <= 5 && population > 2000) qualified_people= 500;
    if(universities > 5 && universities <= 7 && population > 5000) qualified_people= 1000;
    if(universities > 8 && population > 10000) qualified_people= 3000;

    if(qualified_people == 150) money += 150;
    if(qualified_people == 300) money += 300;
    if(qualified_people == 500) money += 500;
    if(qualified_people == 1000) money += 1000;
    if(qualified_people == 3000) money += 3000;
    moodLevelChange();
    population_change();
    money = parseInt(money + working_population * (tax / 100.0));
    income = parseInt(working_population * (tax / 100.0));
    genTable();
  }
  if(secs % 112 == 0){
    money -= zones.length * 10;
  }
  date.innerHTML = format(parseInt(secs / 112) + 2023);
  sm.innerHTML = (parseInt(secs % 112));

  if (tax_inp.value.length != 0) {
    tax = tax_inp.value;
} 
    // console.log("tax: " + tax)
  moodLevelChange()
//   console.log(moodLevel)
  satisfactionLevel.innerHTML = "Satisfaction: " + getMoodLevelStage();


  //Disaster disappearance 
  for(let i = 0; i < disasters.length; i++){
    if(disasters[i].dis_type == 1){     
        if(fire_extinguish(disasters[i].x, disasters[i].y)){
            await new Promise(resolve => setTimeout(resolve, 2000))
            assign(13, disasters[i].x, disasters[i].y);
            genTable();
        }else if(secs - disasters[i].started > 40){
            clearfield(disasters[i].x, disasters[i].y);
        }
        disasters.splice(i, 1);
        if(i >= disasters.length)
            break;
    }
    if(secs - disasters[i].started > 40){
        if(disasters[i].dis_type == 2){
            clearfield(disasters[i].x, disasters[i].y);
            disasters.splice(i, 1);
        }
    }
  }
}
function format(a) {
    return "Date: " + a;
}

/// speed changes 
document.getElementById("speed_slow").addEventListener("click", function() {
    speed = 1;});
document.getElementById("speed_normal").addEventListener("click", function() {
    speed = 2; });
document.getElementById("speed_fast").addEventListener("click", function() {
    speed = 4; });

// Searches source for background image when certain type
// of building becomes bigger i.e grows. Updates table!
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


// saving the game and setting of the game


pause_btn.addEventListener("click", function() {

    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.background = 'white';
    popup.style.boxShadow = '0px 0px 10px grey';
    popup.style.width = '600px'; 
    popup.style.height = '80px';

    // Saving the game
    const Save = document.createElement('button');
    Save.textContent = 'Save';
    Save.style.marginRight = '10px';
    Save.style.width = 140 + "px";

    let classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    Save.classList.add(...classes);

    Save.addEventListener('click', function() {
        let t = secs;
        clearInterval(time);
        secs = 0;
        user = prompt("Please enter your name:");

        Game = {
            board: grid,
            name: user,
            time: secs,
            speed : speed,
            zones : zones,
            income : income,
            expences : expences,
            money : money,
            population : population,
            mood : moodLevel,
            tax : tax,
            disasters : disasters,
            working_population : working_population,
        }
        const games = JSON.parse(localStorage.getItem('games')) ?? [];
        games.push(Game);
        localStorage.setItem('games', JSON.stringify(games));
        start.click();
        popup.remove();
    });
    /** The default pause button */
    const Pause = document.createElement('button');
    Pause.textContent = 'Pause';
    Pause.style.marginRight = '10px';
    Pause.style.width = 140 + "px";
    classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    Pause.classList.add(...classes);
    Pause.addEventListener('click', function() {
        if(paused){
            time = setInterval(count, 1000);
            paused = false;
        }else{
            clearInterval(time);
            paused = true;
        }

        popup.remove();
    });

    // Uploading the saved games with user name and the date in game

    const Upload = document.createElement('button');
    Upload.textContent = 'Upload';
    Upload.style.marginRight = '10px';
    Upload.style.width = 140 + "px";

    classes = ['btn', 'btn--primary', 'btn-small', 'pop', 'dropbtn'];
    Upload.classList.add(...classes);

    const Drop = document.createElement('div');
    Drop.id = "myDropdown2";
    Drop.className = "dropdown-content";
    Upload.addEventListener('click', function() {
        const games = JSON.parse(localStorage.getItem('games')) ?? [];
        Drop.innerHTML = games.map((score) => `<button>${score.name} - ${parseInt(score.time / 112) + 2023}`).join('');
        Drop.classList.toggle("show");
        // popup.remove();
    });

    // canceling
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';

    classes = ['btn', 'btn--primary', 'btn-small', 'pop'];
    cancelBtn.classList.add(...classes);
    cancelBtn.addEventListener('click', function() {
        popup.remove();
    });
    cancelBtn.style.width = 100 + "px";
    
    // Dropdown button all saved games
    Drop.addEventListener('click', function(e){
        let gm = e.target.innerHTML;
        console.log(gm);
        const games = JSON.parse(localStorage.getItem('games')) ?? [];
        for(let i = 0; i < games.length; i++){
            console.log(`${games[i].name} - ${parseInt(games[i].time / 112) + 2023}`);
            if(gm == `${games[i].name} - ${parseInt(games[i].time / 112) + 2023}`){
                grid = games[i].board;
                user = games[i].name;
                secs = games[i].time;
                speed = games[i].speed;
                zones = games[i].zones;
                income = games[i].income;
                expences = games[i].expences;
                money = games[i].money;
                population = games[i].population;
                moodLevel = games[i].mood;
                tax = games[i].tax;
                disasters = games[i].disasters;
                working_population = games[i].working_population;
                console.log(grid);
                time = setInterval(count, 1000);
                genTable(grid);
            }
        }
    })
    
    popup.appendChild(Save);
    popup.appendChild(Upload);
    popup.appendChild(Drop);
    popup.appendChild(Pause);
    popup.appendChild(cancelBtn);
    document.body.appendChild(popup);

}
);

