const FRAMERATE = 0.017; //one divided by FPS
const MOVEMENT_SPEED = 10; //how many multiples of its own height the body box will move

let mousePos;
document.addEventListener("mousemove", (e) => {mousePos = e;});

let vX = 0;
let vY = 0;

function loop() {
  if (!mousePos) return;

  let box = document.querySelector("div");
  
  let hWidth = box.clientWidth * 0.5;
  let hHeight = box.clientHeight * 0.5;
  
  let boxRect = box.getBoundingClientRect();
  let boxCenter = {x: boxRect.left + hWidth, y: boxRect.top + hHeight};
  
  const ACCELERATION = box.clientHeight * 0.1 * FRAMERATE;
  const DECELERATION = ACCELERATION * 0.5;
  
  if ((boxCenter.x - mousePos.clientX)**2 + (boxCenter.y - mousePos.clientY)**2 < box.clientHeight**2) {
    //slowly stop
    if(vX < 0) {
      vX = Math.min(0, vX + DECELERATION);
    } else {
      vX = Math.max(0, vX - DECELERATION);
    }
    if(vY < 0) {
      vY = Math.min(0, vY + DECELERATION);
    } else {
      vY = Math.max(0, vY - DECELERATION);
    }
    
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

    //choose which one is closest
    let intersect;
    if((pointA.x**2 + pointA.y**2) < (pointB.x**2 + pointB.y**2)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }

    //step 2: move towards goal
    //goalVX/Y is intersect * FRAMERATE * MOVEMENT_SPEED
    //actual vX/Y slowly changes by ACCELERATION to match goalVX/Y
    let goalVX = intersect.x * FRAMERATE * MOVEMENT_SPEED;
    let goalVY = intersect.y * FRAMERATE * MOVEMENT_SPEED;

    if(intersect.x < 0) {
      vX = Math.max(goalVX, vX - ACCELERATION);
    } else {
      vX = Math.min(goalVX, vX + ACCELERATION);
    }
    if(intersect.y < 0) {
      vY = Math.max(goalVY, vY - ACCELERATION);
    } else {
      vY = Math.min(goalVY, vY + ACCELERATION);
    }
  }

  //after everything, add velocity
  box.style.left = boxRect.left + vX + "px";
  box.style.top = boxRect.top + vY + "px";
  
}

setInterval(loop, FRAMERATE * 1000);
