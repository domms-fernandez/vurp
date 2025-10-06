let mousePos;
document.addEventListener("mousemove", (e) => {mousePos = e;});

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}

function restrict(max, min, num) {
  return Math.max(Math.min(max, num), min);
}

let sackboy = document.querySelector("img");
let sackboyA = document.getElementById("a");
let sackboyB = document.getElementById("b");
let box = document.querySelector("div");
let hWidth;
let hHeight;
let vX = 0;
let vY = 0;
let maxV;

function loop() {
  if (!mousePos) return;

  maxV = box.clientHeight * 0.017 * 0.05;

  hWidth = box.clientWidth * 0.5;
  hHeight = box.clientHeight * 0.5;
  let boxRect = box.getBoundingClientRect();
  let boxCenter = {x: boxRect.left + hWidth, y: boxRect.top + hHeight};
  
  if (distance(boxCenter.x, boxCenter.y, mousePos.clientX, mousePos.clientY) < hWidth + hHeight) {
    sackboy.style.left = 400;
    sackboy.style.top = 400;
  } else {
    //move towards goal
    let pointA = {x: hWidth,  y: 0}; //the x value if it intercepts the side lines,
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

    sackboyA.style.left = pointA.x + boxCenter.x + "px";
    sackboyA.style.top = pointA.y + boxCenter.y + "px";
    sackboyB.style.left = pointB.x + boxCenter.x + "px";
    sackboyB.style.top = pointB.y + boxCenter.y + "px";

    let intersect;
    if((pointA.x**2 + pointA.y**2) < (pointB.x**2 + pointB.y**2)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }
    intersect.x += boxCenter.x;
    intersect.y += boxCenter.y;

    sackboy.style.left = intersect.x - 5 + "px";
    sackboy.style.top = intersect.y - 5 + "px";
  }
}

setInterval(loop, 17);
