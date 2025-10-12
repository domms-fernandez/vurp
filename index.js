const ISAAC_SPEED = 5; //how many multiples of its own height the body box will move/sec
const FRAMERATE = 0.017; //one divided by FPS

const ISAAC_HEAD_SPRITEMAP = [
{
  frames: 1,
  duration: 1,
  start: 0
},
{
  frames: 1,
  duration: 1,
  start: 1
},
{
  frames: 1,
  duration: 1,
  start: 2
},
{
  frames: 1,
  duration: 1,
  start: 3
}
];

const ISAAC_WALK_SPRITEMAP = [
//idle
{
  frames: 1,
  duration: 1,
  start: 0
},
//walking
{
  frames: 10,
  duration: 1,
  start: 0
},
//hidden, horizontal movement
{
  frames: 1,
  duration: 1,
  start: -1
}
];

const ISAAC_WALK_EAST_SPRITEMAP = [
//hidden
{
  frames: 1,
  duration: 1,
  start: -1
},
//walking
{
  frames: 10,
  duration: 1,
  start: 0
}];


//spriteAnimator class
function spriteAnimator(spritemap, element, verticallyAnimated) {
  this.spritemap = spritemap;
  this.element = element;
  this.verticallyAnimated = verticallyAnimated;
  this.mirrored = false;
  this.selection = 0;
  this.animTime = 0;
  this.animSpeed = 1;

  this.update();
}

spriteAnimator.prototype.update = function() {
  let maxAnimLength = this.spritemap[this.selection].duration / this.animSpeed;
  
  //scale animTime appropriately
  while (this.animTime >= maxAnimLength)
    this.animTime -= maxAnimLength;
  while (this.animTime < 0)
    this.animTime += maxAnimLength;

  //we need to find what frame we're on, based on spritemap's frames and duration vs animTime
  //sptmp.frames / sptmp.duration = frame changes/sec
  //floor fps * animTime = what frame we're on

  let offset = (this.spritemap[this.selection].start + 
    Math.floor((this.spritemap[this.selection].frames / maxAnimLength) * this.animTime)) * -1;
  
  //then we need to find the offset in multiples of width/height, mirror if verticallyAnimated
  if(this.verticallyAnimated) {
    offset = offset * this.element.clientHeight;
    this.element.firstElementChild.style.top = offset + "px";
    
    if(this.mirrored) {this.element.firstElementChild.style.transform = "scaleX(-1)";}
    else {this.element.firstElementChild.style.transform = "scaleX(1)";}
  }
  else {
    offset *= this.element.clientWidth;
    this.element.firstElementChild.style.left = offset + "px";
  }
};


let head = document.getElementById("head");
let body = document.getElementById("body");
let bodyEast = document.getElementById("body-east");

let headAnimator = new spriteAnimator(ISAAC_HEAD_SPRITEMAP, head, false);
let bodyAnimator = new spriteAnimator(ISAAC_WALK_SPRITEMAP, body, false);
let bodyEastAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEast, true);

body.style.left = Math.floor(Math.random() * (window.innerWidth - body.clientWidth)) + "px";
body.style.top = Math.floor(Math.random() * (window.innerHeight - body.clientHeight)) + "px";

let bodyRect = body.getBoundingClientRect(); //we use this later

head.style.top = bodyRect.top + -60 + "px";
head.style.left = bodyRect.left + -15 + "px";


let mousePos;
let vX = 0; let vY = 0;


function loop() {
  if (!mousePos) return;

  let halfBodyWidth = body.clientWidth * 0.5;
  let halfBodyHeight = body.clientHeight * 0.5;
  let centerBodyX = bodyRect.left + halfBodyWidth;
  let centerBodyY = bodyRect.top + halfBodyHeight;
  
  //if mouse is within body diameter
  if((mousePos.x - centerBodyX)**2 + (mousePos.y - centerBodyY)**2 < halfBodyHeight**2) {
    vX *= 0.9;
    vY *= 0.9;

    headAnimator.selection = 0;
    headAnimator.animTime = 0;
    
    bodyAnimator.selection = 0;
    bodyAnimator.animTime = 0;
    
    bodyEastAnimator.selection = 0;
    bodyEastAnimator.animTime = 0;
    
  }
  
  //if mouse is outside of body diameter
  else {
    let relativeMouseX = mousePos.x - centerBodyX;
    let relativeMouseY = mousePos.y - centerBodyY;

    let radiusRatio = body.clientHeight / Math.sqrt(relativeMouseX**2 + relativeMouseY**2);
    vX = relativeMouseX * radiusRatio;
    vY = relativeMouseY * radiusRatio;

    let absVX = Math.abs(vX);
    let absVY = Math.abs(vY);
    
    //horizontal dominated
    if(absVX > absVY) {
      bodyAnimator.selection = 2;
      bodyAnimator.animTime = 0;
      bodyEastAnimator.selection = 1;
      bodyEastAnimator.animTime += FRAMERATE;
      bodyEastAnimator.animSpeed = absVX / halfBodyWidth;
      if (vX > 0) {
        headAnimator.selection = 1;
        bodyEastAnimator.mirrored = false;
      }
      else {
        headAnimator.selection = 3;
        bodyEastAnimator.mirrored = true;
      }
    }
    //vertical dominated
    else {
      bodyEastAnimator.selection = 0;
      bodyEastAnimator.animTime = 0;
      bodyAnimator.selection = 1;
      bodyAnimator.animSpeed = absVY / halfBodyHeight;
      if (vY > 0) {
        headAnimator.selection = 0;
        bodyAnimator.animTime += FRAMERATE;
      }
      else {
        headAnimator.selection = 2;
        bodyAnimator.animTime -= FRAMERATE;
      }
    }

    vX = vX * ISAAC_SPEED * FRAMERATE;
    vY = vY * ISAAC_SPEED * FRAMERATE;
  }

  body.style.left = bodyRect.left + vX + "px";
  body.style.top = bodyRect.top + vY + "px";
  bodyRect = body.getBoundingClientRect();

  head.style.left = bodyRect.left + -15 + "px";
  head.style.top = bodyRect.top + -60 + "px";
  
  bodyEast.style.left = bodyRect.left + "px";
  bodyEast.style.top = bodyRect.top + "px";
  
  headAnimator.update();
  bodyAnimator.update();
  bodyEastAnimator.update();
}
  

//how does swallowing pills work?
function swallow() {
  //placeholder!
  new Audio("/vurp/sfx/derp.wav").play();
  head.firstElementChild.src = "/vurp/img/isaac-head-pills-sheet.png";
}

document.querySelectorAll("div").forEach((v) => {v.addEventListener("click", swallow);});
document.addEventListener("mousemove", (e) => {mousePos = e;});

setInterval(loop, FRAMERATE * 1000);
