let img = document.querySelector("img");
let button = document.getElementById("center");
let scream = new Audio("/gay/howie.mp3");

//RUUUNNNN
document.addEventListener("mousemove", (e) => {
  let buttonPos = button.getBoundingClientRect(); //x and y of button

  let pointA = {x: Math.round(button.clientWidth * 0.5) + 3,  y: 0}; //the x value if it intercepts the side lines,
  let pointB = {y: Math.round(button.clientHeight * 0.5) + 3, x: 0}; //and the y value for the top and bottom lines.
                                                                              //incidently 1/2 width/height of the button
  //mouse X and Y relative to the center point of the button, which is (0, 0)
  let mouseX = e.clientX - buttonPos.left - pointA.x;
  let mouseY = e.clientY - buttonPos.top - pointB.y;

  let slope = mouseY/mouseX;

  if(mouseX < 0) {pointA.x *= -1; pointA.x -= 2;} //calculate intersection on the side of the button that is moving
  if(mouseY < 0) {pointB.y *= -1; pointB.y -= 2;} //away from the mouse, so it doesn't clip across the screen

  //complete points of intersection
  pointA.y = Math.round(slope * pointA.x);
  pointB.x = Math.round(pointB.y / slope);

  //pythagoras mothafucka!
  if((pointA.x**2 + pointA.y**2) < (pointB.x**2 + pointB.y**2)) {
    let movementLeft = buttonPos.left - (pointA.x - mouseX);
    if(movementLeft < 0) movementLeft += window.innerWidth;
    if(movementLeft > window.innerWidth) movementLeft -= window.innerWidth;
    button.style.left = movementLeft;

    let movementTop = buttonPos.top - (pointA.y - mouseY);
    if(movementTop < 0) movementTop += window.innerHeight;
    if(movementTop > window.innerHeight) movementTop -= window.innerHeight;
    button.style.top = movementTop;
  } else {
    let movementLeft = buttonPos.left - (pointB.x - mouseX);
    if(movementLeft < 0) movementLeft += window.innerWidth;
    if(movementLeft > window.innerWidth) movementLeft -= window.innerWidth;
    button.style.left = movementLeft;

    let movementTop = buttonPos.top - (pointB.y - mouseY);
    if(movementTop < 0) movementTop += window.innerHeight;
    if(movementTop > window.innerHeight) movementTop -= window.innerHeight;
    button.style.top = movementTop;
  }
});

/*let mousePos;

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
let vX;
let vY;
const maxV = 0.5;

function loop() {
  if (!mousePos) return;

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

    sackboyA.style.left = pointA.x + boxCenter.x;
    sackboyA.style.top = pointA.y + boxCenter.y;
    sackboyB.style.left = pointB.x + boxCenter.x;
    sackboyB.style.top = pointB.y + boxCenter.y;

    let intersect;
    if(distance(boxCenter.x, boxCenter.y, pointA.x, pointA.y) < distance(boxCenter.x, boxCenter.y, pointB.x, pointB.y)) {
      intersect = pointA;
    } else {
      intersect = pointB;
    }

    console.log(intersect);

    sackboy.style.left = 300;
    sackboy.style.top = 300;
  }
}

document.addEventListener("mousemove", (e) => {mousePos = e; loop();});
//setInterval(loop, 17);
*/
