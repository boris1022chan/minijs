var totalPoints;

var bestdistance = Infinity;
var bestorder;

var totalPopulation = 10;
var population = [];
var fitness = [];
var mutationRate = 0.2;

function btnClick() {
    var canvas = document.getElementById("myCanvas");
    canvas.removeEventListener('click', trackClicker);
    totalPoints = points.length;

    var order = [];
    for (i=0; i<totalPoints; i++) {
        order[i] = i;
    }

    totalPopulation *= Math.ceil(Math.sqrt(totalPoints));

    for (var i=0; i<totalPopulation; i++) {
        population[i] = shuffle(order.slice());
    }

    console.log("number of points:", totalPoints);
    console.log("population:", totalPopulation);
    setInterval(GA, 100);
}

function GA() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints();
    calcFitness();
    normalizeFittness();
    drawBestPath();
    console.log(bestdistance);
    nextGeneration();
}

function shuffle(arr) {
    var curIndex = totalPoints;
    while (curIndex !== 0) {
        var swapIndex = Math.floor(Math.random()*curIndex);
        curIndex -= 1;

        var temp = arr[curIndex];
        arr[curIndex] = arr[swapIndex];
        arr[swapIndex] = temp;
    }
    return arr;
}

function calcDistance(arr) {
    var d = 0;
    for (var i=0; i<totalPoints-1; i++) {
        var p1 = points[arr[i]];
        var p2 = points[arr[i+1]];

        d += Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
    }

    if (d < bestdistance) {
        bestdistance = d;
        bestorder = arr.slice();
    }
    return d;
}

function calcFitness() {
    for (var i=0; i<totalPopulation; i++) {
        var d = calcDistance(population[i]);
        fitness[i] = 1 / (d+1);
    }
}

function normalizeFittness() {
    var sum = 0;
    for (var i=0; i<totalPopulation; i++) {
        sum += fitness[i];
    }
    for (var i=0; i<totalPopulation; i++) {
        fitness[i] /= sum;
    }
}

function nextGeneration() {
    var newpopulation = [];
    for (var i=0; i<totalPopulation; i++) {
        var orderA = pickOne();
        var orderB = pickOne();
        var order = crossover(orderA, orderB);
        mutate(order);
        newpopulation[i] = order;
    }
    population = newpopulation;
}

function pickOne() {
    var index = 0;
    var rand = Math.random();
    while (rand > 0) {
        rand -= fitness[index];
        index ++;
    }
    index--;
    return population[index].slice();
}

function crossover(orderA, orderB) {
    var start = Math.floor(Math.random()*totalPoints);
    var end = Math.floor(Math.random()*(totalPoints-start));
    var neworder = orderA.slice(start, start+end);

    var left = totalPoints - neworder.length;
    for (var i=0; i<totalPoints; i++) {
        if(!neworder.includes(orderB[i])) {
            neworder.push(orderB[i]);
        }
    }
    return neworder.slice();
}

function mutate(item) {
    for (var i=0; i < totalPoints; i++) {
        var r = Math.random()
        if (r < mutationRate) {
            var rand = Math.random();
            var index1;
            var index2;
            if (rand >= 0.3) {
                index1 = Math.floor(Math.random()*totalPoints);
                index2 = index1-1;
                if (index2 < 0) {
                    index2 = index1+1;
                }
            }
            else {
                index1 = Math.floor(Math.random()*totalPoints);
                index2 = Math.floor(Math.random()*totalPoints);
            }
            var temp = item[index2];
            item[index2] = item[index1];
            item[index1] = temp;
        }
    }
}

function drawPoints() {
    for (i=0; i<totalPoints; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x,points[i].y, pointradius, 0, Math.PI*2);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }
}

function drawBestPath() {
    for (i=0; i<totalPoints-1; i++) {
        var p1 = points[bestorder[i]];
        var p2 = points[bestorder[i+1]];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 5;
        ctx.closePath();
        ctx.stroke();
    }
}