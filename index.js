const FRAMERATE = 0.017;
const MOVEMENTSPEED = 2;
let mousePos;
document.addEventListener("mousemove", (e) => {mousePos = e;});

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

function restrict(max, min, num) {
  return Math.max(Math.min(max, num), min);
}

let box = document.querySelector("div");
let hWidth;
let hHeight;
let vX = 0;
let vY = 0;

function loop() {
  if (!mousePos) return;

  hWidth = box.clientWidth * 0.5;
  hHeight = box.clientHeight * 0.5;
  let boxRect = box.getBoundingClientRect();
  let boxCenter = {x: boxRect.left + hWidth, y: boxRect.top + hHeight};
  
  if (distance(boxCenter.x, boxCenter.y, mousePos.clientX, mousePos.clientY) < box.clientHeight) {
    //slowly stop
    //slowly remove 1/30th of height from speed until 0
    
  } else {
    //move towards goal
    //step 1: goal point
    let pointA = {x: hHeight,  y: 0}; //the x value if it intercepts the side lines,
    let pointB = {y: hHeight, x: 0};  //and the y value for the top and bottom lines.
    
    //mouse X and Y relative to the center point of the button, which is (0, 0)
    let relativeMouseX = mousePos.clientX - boxCenter.x;
    let relativeMouseY = mousePos.clientY - boxCenter.y;

    let slope = relativeMouseY/relativeMouseX;
    
    if(relativeMouseX < 0) {pointA.x *= -1;} //calculate intersection on the side of
    if(relativeMouseY < 0) {pointB.y *= -1;} //the button that is facing the mouse

    //complete points of intersection
    pointA.y = slope * pointA.x;
    pointB.x = pointB.y / slope;

    let intersect;
    if((pointA.x**2 + pointA.y**2) < (pointB.x**2 + pointB.y**2)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }

    //step 2: move towards goal
    //goalVX/Y is intersect * FRAMERATE
    //actual vX/Y slowly changes to match goalVX/Y

    let goalVX = intersect.x * FRAMERATE * MOVEMENTSPEED;
    let goalVY = intersect.y * FRAMERATE * MOVEMENTSPEED;

    vX = restrict(goalVX, -goalVX, vX + FRAMERATE * MOVEMENTSPEED * goalVX);
    vY = restrict(goalVY, -goalVY, vY + FRAMERATE * MOVEMENTSPEED * goalVY);
    
    box.style.left = boxRect.left + vX + "px";
    box.style.top = boxRect.top + vY + "px";
    
  }
}

setInterval(loop, 17);
