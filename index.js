const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// for intro motion
let mouseMoved = false;

let mouse = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
    tX: 0,
    tY: 0
}
let params = {
    pointsNumber: 25,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .43,
    friction: .5
};

const touchTrail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    touchTrail[i] = {
        x: mouse.x,
        y: mouse.y,
        vx: 0,
        vy: 0,
    }
}

window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

function updateMousePosition(eX, eY) {
    mouse.tX = eX;
    mouse.tY = eY;
}

setupCanvas();
updateBubbles(0);
window.addEventListener('resize', () => {
    setupCanvas();
});


function updateBubbles(t) {

    // for intro motion
    if (!mouseMoved) {
        mouse.tX = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        mouse.tY = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    // change
    touchTrail.forEach((p, pIdx) => {
        if (pIdx === 0) {
            p.x = mouse.x;
            p.y = mouse.y + 25;
            ctx.moveTo(p.x, p.y);
        } else {
            p.vx += (touchTrail[pIdx - 1].x - p.x) * params.spring;
            p.vy += (touchTrail[pIdx - 1].y - p.y) * params.spring;
            p.vx *= params.friction;
            p.vy *= params.friction;

            p.x += p.vx;
            p.y += p.vy;
        }
    });

    for (let i = 1; i < touchTrail.length - 1; i++) {
        const xc = .5 * (touchTrail[i].x + touchTrail[i + 1].x);
        const yc = .5 * (touchTrail[i].y + touchTrail[i + 1].y);
        ctx.quadraticCurveTo(touchTrail[i].x, touchTrail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(touchTrail[touchTrail.length - 1].x, touchTrail[touchTrail.length - 1].y);
    ctx.stroke();

    mouse.x += (mouse.tX - mouse.x) * params.mouseThreshold;
    mouse.y += (mouse.tY - mouse.y) * params.mouseThreshold;

    window.requestAnimationFrame(updateBubbles);
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}