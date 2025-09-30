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
let hHeight;
let vX;
let vY;
const maxV = 0.5;

function loop() {
  if (mousePos === false) return;

  hWidth = box.clientWidth * 0.5;
  hHeight = box.clientHeight * 0.5;
  let boxRect = box.getBoundingClientRect();
  let boxCenter = {x: boxRect.left + hWidth, y: boxRect.top + hHeight};
  
  if (distance(boxCenter.x, boxCenter.y, mousePos.x, mousePos.y) < hWidth + hHeight) {
    //slowly stop moving
  } else {
    //move towards goal
    let pointA = {x: hWidth,  y: 0}; //the x value if it intercepts the side lines,
    let pointB = {y: hHeight, x: 0};  //and the y value for the top and bottom lines.
    
    //mouse X and Y relative to the center point of the button, which is (0, 0)
    let relativeMouseX = mousePos.x - boxCenter.x;
    let relativeMouseY = mousePos.y - boxCenter.y;

    let slope = relativeMouseY/relativeMouseX;

    if(relativeMouseX < 0) {pointA.x *= -1;} //calculate intersection on the side of
    if(relativeMouseY < 0) {pointB.y *= -1;} //the button that is facing the mouse

    //complete points of intersection
    pointA.y = slope * pointA.x;
    pointB.x = pointB.y / slope;

    let intersect;
    if(distance(boxCenter.x, boxCenter.y, pointA.x, pointA.y) < distance(boxCenter.x, boxCenter.y, pointB.x, pointB.y)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }

    console.log(intersect);

    sackboy.style.left = intersect.x + boxCenter.x;
    sackboy.style.top = intersect.y + boxCenter.y;
    
  }
}

setInterval(loop, 17);
