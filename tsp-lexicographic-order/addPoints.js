var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var pointradius = 4;
var points = [];
function Point(x,y) {
    this.x = x;
    this.y = y;
}

canvas.addEventListener('click', trackClicker);

function trackClicker(e) {
    // cursor coord
    cursorX = e.pageX;
    cursorY = e.pageY;

    // get coord relative to canvas
    var rect = canvas.getBoundingClientRect();
    x = Math.ceil(cursorX - rect.left);
    y = Math.ceil(cursorY -rect.top);

    // draw coordinate on canvas
    ctx.beginPath();
    ctx.arc(x,y, pointradius, 0, Math.PI*2);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    // store point in array
    var newpoint = new Point(x,y);
    points.push(newpoint);
}