let mousePos = false;
document.addEventListener("mousemove", (e) => {mousePos = e;});

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

function restrict(max, min, num) {
  return Math.max(Math.min(max, num), min);
}

let box = document.querySelector("div");
let hWidth = 100;
let hHeight = 100;
let vX;
let vY;
const maxVX = 0.5;
const maxVY = 0.5;
let x;
let y;


function loop() {
  if (!mousePos) return;
  if (distance(x, y, mousePos.x, mousePos.y) < (hWidth + hHeight) * 0.5) {
    //slowly stop moving
  } else {
    //move towards goal
  }

  setTimeout(loop(), 17);
}

