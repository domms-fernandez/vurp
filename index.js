let mousePos = false;
document.addEventListener("mousemove", (e) => {mousePos = e;});

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

function restrict(max, min, num) {
  return Math.max(Math.min(max, num), min);
}

let sackboy = document.querySelector("img");
let box = document.querySelector("div");
let hWidth;
let vX;
let vY;
const maxV = 0.5;
let x;
let y;


function loop() {
  if (!mousePos) return;

  hWidth = box.clientWidth * 0.5;
  
  if (distance(x, y, mousePos.x, mousePos.y) < hWidth) {
    //slowly stop moving
  } else {
    //move towards goal
    let pointA = {x: hWidth,  y: 0}; //the x value if it intercepts the side lines,
    let pointB = {y: hWidth, x: 0};  //and the y value for the top and bottom lines.
    
    //mouse X and Y relative to the center point of the button, which is (0, 0)
    let mouseX = mousePos.x - box.style.left;
    let mouseY = mousePos.y - box.style.top;

    let slope = mouseY/mouseX;

    if(mouseX < 0) {pointA.x *= -1;} //calculate intersection on the side of the button that is moving
    if(mouseY < 0) {pointB.y *= -1;} //away from the mouse, so it doesn't clip across the screen

    //complete points of intersection
    pointA.y = slope * pointA.x;
    pointB.x = pointB.y / slope;

    let intersect;
    if(distance(box.style.left, box.style.top, pointA.x, pointA.y) < distance(box.style.left, box.style.top, pointB.x, pointB.y)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }

    console.log(intersect);

    sackboy.style.left = Math.floor(intersect.x);
    sackboy.style.top = Math.floor(intersect.y);
    
  }
}

setInterval(loop, 17);
