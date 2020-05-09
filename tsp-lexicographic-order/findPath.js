var totalPoints;
var order = [];

var bestdistance = Infinity;
var bestorder;

function btnClick() {
    var canvas = document.getElementById("myCanvas");
    canvas.removeEventListener('click', trackClicker);
    totalPoints = points.length;

    for (i=0; i<totalPoints; i++){
        order[i] = i;
    }

    bestorder = order.slice();
    interval = setInterval(mainloop, 100);
}

function mainloop () {
    console.log(order);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints()
    drawBestPath();
    calcDistance(order);
    drawPath(order);
    var result = nextPermutation();
    if (result === 0) {
        clearInterval(interval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPoints();
        drawBestPath();
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

function nextPermutation() {
    var a = -1;
    for (i=0; i<totalPoints-1; i++) {
        if (order[i]<order[i+1]) {
            a=i;
        }
    }
    if (a === -1) {
        console.log("finish");
        return 0;
    }

    var b;
    for (i=a; i<totalPoints; i++) {
        if (order[a] < order[i]) {
            b=i;
        }
    }

    var temp = order[a];
    order[a] = order[b];
    order[b] = temp;

    var prefix = order.slice(0, a);
    var suffix = order.slice(a+1);
    suffix.reverse();
    order = prefix.concat(order[a],suffix);
    return 1;
}

function calcDistance(arr) {
    var d = 0;
    for (i=0; i<totalPoints-1; i++) {
        var p1 = points[arr[i]];
        var p2 = points[arr[i+1]];

        d += Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
    }
    console.log("distance:", d);
    console.log("current best:", bestdistance);
    if (d < bestdistance) {
        bestdistance = d;
        bestorder = arr.slice();
    }
}

function drawPath(arr) {
    for (i=0; i<totalPoints-1; i++) {
        var p1 = points[arr[i]];
        var p2 = points[arr[i+1]];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.closePath();
        ctx.stroke();
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