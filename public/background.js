/// <reference path="../jquery/jquery.d.ts" />
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector;
})();

var Cloud = (function () {
    function Cloud() {
    }
    return Cloud;
})();

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var drawThinLine = function (start, end) {
    ctx.moveTo(Math.floor(start.x) + 0.5, Math.floor(start.y) + 0.5);
    ctx.lineTo(Math.floor(end.x) + 0.5, Math.floor(end.y) + 0.5);
};

var current = null;
var starPositions = [];
var clouds = [];

var width, height;

var doAnimation = function (timestamp) {
    ctx.clearRect(0, 0, width, height);

    if (current === null) {
        current = timestamp;
    }
    var delta = timestamp - current;
    current = timestamp;

    ctx.lineWidth = 1;

    //Draw FPS
    //ctx.strokeText("" + Math.floor(1000 / delta), 10, 20);
    //Draw stars
    ctx.strokeStyle = "white";
    ctx.beginPath();
    for (var i = 0; i < 100; i++) {
        drawThinLine(new Vector(starPositions[i].x, starPositions[i].y - 2), new Vector(starPositions[i].x, starPositions[i].y + 2));
        drawThinLine(new Vector(starPositions[i].x - 2, starPositions[i].y), new Vector(starPositions[i].x + 2, starPositions[i].y));
    }
    ctx.closePath();
    ctx.stroke();

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < clouds[i].length; ++j) {
            clouds[i][j].position.x += 1 / (i + 1);
            if (clouds[i][j].position.x > width + 100) {
                clouds[i][j].position.x = -200;
            }
        }
    }

    //Draw fog
    var grad = ctx.createLinearGradient(0, height - 170, 0, height);
    grad.addColorStop(0, "rgba(150, 150, 150, 0.01)");
    grad.addColorStop(0.05, "rgba(150, 150, 150, 0.1)");
    grad.addColorStop(0.5, "rgba(150, 150, 150, 0.4)");
    grad.addColorStop(1, "rgba(150, 150, 150, 0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, height - 170, width, 170);

    //Draw clouds
    ctx.lineWidth = 10;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.beginPath();
    for (var i = 3; i >= 0; i--) {
        for (var j = 0; j < clouds[i].length; j++) {
            var cloud = clouds[i][j];
            var factor = 1 / Math.pow((i + 1), 1.5);
            var distance = 70 * factor;

            ctx.moveTo(cloud.position.x - 0.5 * distance, cloud.position.y - 20 * factor);
            ctx.arc(cloud.position.x - 0.5 * distance, cloud.position.y - 20 * factor, 20 * factor, 0, 2 * Math.PI);
            ctx.arc(cloud.position.x, cloud.position.y - cloud.firstRadius * factor, cloud.firstRadius * factor, 0, 2 * Math.PI);
            ctx.arc(cloud.position.x + distance, cloud.position.y - cloud.secondRadius * factor, cloud.secondRadius * factor, 0, 2 * Math.PI);
            ctx.arc(cloud.position.x + 2 * distance, cloud.position.y - cloud.thirdRadius * factor, cloud.thirdRadius * factor, 0, 2 * Math.PI);
            ctx.arc(cloud.position.x + 2.8 * distance, cloud.position.y - 25 * factor, 25 * factor, Math.PI, 3 * Math.PI);

            ctx.fillRect(cloud.position.x - 0.5 * distance, cloud.position.y - 30 * factor, 3.3 * distance, 30 * factor);
        }
    }
    ctx.closePath();
    ctx.fill();

    //Draw boy
    ctx.save();
    ctx.translate(0, Math.sin(timestamp / 1000) * 5);

    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.strokeStyle = "rgb(200, 200, 200)";
    ctx.beginPath();
    ctx.arc(40, height - 300, 5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(42.5, height - 300);
    ctx.lineTo(42.5, height - 300 + 30);

    ctx.moveTo(42.5, height - 300 + 5);
    ctx.lineTo(47.5, height - 300 - 15);

    ctx.moveTo(42.5, height - 300 + 5);
    ctx.lineTo(40, height - 300 + 25);

    ctx.moveTo(42.5, height - 300 + 30);
    ctx.lineTo(44.5, height - 300 + 40);
    ctx.moveTo(44.5, height - 300 + 40);
    ctx.lineTo(42.5, height - 300 + 50);

    ctx.moveTo(42.5, height - 300 + 30);
    ctx.lineTo(45.5, height - 300 + 37);
    ctx.moveTo(45.5, height - 300 + 37);
    ctx.lineTo(41.5, height - 300 + 44);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(47.5, height - 300 - 15);
    ctx.lineTo(47.5, height - 300 - 35);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(46.5, height - 300 - 35, 1.5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    var glow = ctx.createRadialGradient(46.5, height - 300 - 35, 0, 46.5, height - 300 - 35, 20);
    glow.addColorStop(0, "rgba(255, 255, 0, 0.5)");
    glow.addColorStop(0.5, "rgba(255, 255, 0, 0.2)");
    glow.addColorStop(0.7, "rgba(255, 255, 0, 0.1)");
    glow.addColorStop(1, "rgba(255, 255, 0, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(46.5, height - 300 - 35, 30, 0, 2 * Math.PI);
    ctx.lineTo(46.5, height - 300 - 35);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    requestAnimationFrame(doAnimation);
};

$(document).ready(function () {
    document.body.appendChild(canvas);
    requestAnimationFrame(doAnimation);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "fixed";

    for (var i = 0; i < 100; ++i) {
        var pos = new Vector(Math.random() * width, Math.random() * height - 175);
        starPositions.push(pos);
    }

    for (var i = 0; i < 4; ++i) {
        clouds.push([]);
        for (var j = 0; j < width * Math.pow((i + 1), 1.5) / 1200; j++) {
            var cloud = new Cloud();
            cloud.position = new Vector(Math.random() * width * 2 - width / 2, height - 170 + (180 + Math.random() * 50 - 25) / Math.pow((i + 1), 1.5));
            cloud.firstRadius = Math.random() * 20 + 30;
            cloud.secondRadius = Math.random() * 25 + 60;
            cloud.thirdRadius = Math.random() * 20 + 40;
            clouds[i].push(cloud);
        }
    }
});
