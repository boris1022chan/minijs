var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext('2d');

var DEFAULT_SIZE = 20;
var cols = DEFAULT_SIZE;
var rows = DEFAULT_SIZE;
var size;
var frame_rate = 10;
var cw;
var grids = [];
var current;

var stack = [];
var bestLen = 0;
var deepest;

var int;

function setup () {
    var op_winW = window.innerWidth * 0.8;
    var op_winH = window.innerHeight * 0.8;

    if (document.getElementById("col").value !== "")
        cols = document.getElementById("col").value;
    if (document.getElementById("row").value !== "")
        rows = document.getElementById("row").value;
    size = cols * rows;

    cw = Math.min(Math.floor(op_winW/cols), Math.floor(op_winH/rows));
    canvas.width = cols * cw;
    canvas.height = rows * cw;

    for (var j=0; j<rows; j++) {
        for (var i=0; i<cols; i++) {
            var cell = new Cell(i,j);
            grids.push(cell);
        }
    }

    current = grids[0];
    current.visited = true;

    if (size <= 100) {
        frame_rate = 75;
    }
    else if (size <= 625) {
        frame_rate = 40;
    }
    else {
        frame_rate = 10;
    }
    int = setInterval(draw, frame_rate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var len = grids.length;
    for (var i=0; i<len; i++) {
        grids[i].show(true);
    }

    var next = current.checkNeighbours();
    if (next) {
        stack.push(current);
        if (stack.length > bestLen) {
            bestLen = stack.length;
            deepest = next;
        }

        removeWalls(current, next);
        current = next;
        current.visited = true;
    }
    else if (stack.length != 0) {
        current = stack.pop();
    }
    else {
        clearInterval(int);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var len = grids.length;
        for (var i=0; i<len; i++) {
            grids[i].show(false);
        }

        grids[0].colorCell();
        deepest.colorCell();

        var downloadButton = document.getElementsByClassName("download")[0];
        var reloadButton = document.getElementsByClassName("reload")[0];
        downloadButton.style.display = "inline-block";
        reloadButton.style.display = "inline-block";
    }
}

function index(i, j) {
    if (i<0 || i >= cols || j<0 || j >= rows)
        return -1;
    return i + j * cols;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    // start from top left, clockwise
    this.wall = [true, true, true, true];

    this.show = function(notFinal) {
        var x = this.i * cw;
        var y = this.j * cw;

        if (this.wall[0])
            this.drawWall(x   , y   , true);
        if (this.wall[1])
            this.drawWall(x+cw, y   , false);
        if(this.wall[2])
            this.drawWall(x   , y+cw, true);
        if(this.wall[3])
            this.drawWall(x   , y   , false);
        if (notFinal && this.visited) {
            ctx.beginPath();
            ctx.fillStyle = '#865fe2';
            ctx.closePath;
            ctx.fillRect(x, y, cw, cw);
        }
    };

    this.drawWall = function(x, y, h_or_v) {
        ctx.beginPath();
        ctx.moveTo(x,y);
        if (h_or_v) {
            ctx.lineTo(x+cw, y);
        }
        else {
            ctx.lineTo(x, y+cw);
        }
        ctx.strokeStyle = "black";
        ctx.closePath();
        ctx.stroke();
    };

    this.checkNeighbours = function() {
        var neighbours = [];

        var top = grids[index(i, j-1)];
        var right = grids[index(i+1, j)];
        var bottom = grids[index(i, j+1)];
        var left = grids[index(i-1, j)];

        if (top && !top.visited)
            neighbours.push(top);
        if (right && !right.visited)
            neighbours.push(right);
        if (bottom && !bottom.visited)
            neighbours.push(bottom);
        if (left && !left.visited)
            neighbours.push(left);
        if (neighbours.length > 0) {
            var nextIndex = Math.floor(Math.random() * neighbours.length);
            return neighbours[nextIndex];
        }
        else
            return undefined;
    }

    this.colorCell = function() {
        var x = this.i * cw;
        var y = this.j * cw;

        ctx.beginPath();
        ctx.fillStyle = '#c4c4c4';
        ctx.closePath;
        ctx.fillRect(x+2, y+2, cw-4, cw-4);
    }
}

function removeWalls(a, b) {
    var x = a.i - b.i;
    if (x === -1) {
        a.wall[1] = false;
        b.wall[3] = false;
    }
    else if (x === 1) {
        a.wall[3] = false;
        b.wall[1] = false;
    }

    var y = a.j - b.j;
    if (y === -1) {
        a.wall[2] = false;
        b.wall[0] = false;
    }
    else if (y === 1) {
        a.wall[0] = false;
        b.wall[2] = false;
    }
}