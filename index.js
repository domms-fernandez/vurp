const MOVEMENT_SPEED = 10; //how many multiples of its own height the body box will move/sec
const FRAMERATE = 0.017; //one divided by FPS

const ISAAC_HEAD_SPRITEMAP = [{
  frames: 1,
  duration: 1,
  start: 0,
  width: 28,
  height: 25
},
{
  frames: 1,
  duration: 1,
  start: 1,
  width: 28,
  height: 25
},
{
  frames: 1,
  duration: 1,
  start: 2,
  width: 28,
  height: 25
},
{
  frames: 1,
  duration: 1,
  start: 3,
  width: 28,
  height: 25
}
];

const ISAAC_WALK_SPRITEMAP = [
//idle
{
  frames: 1,
  duration: 1,
  start: 0,
  width: 18,
  height: 15
},
//walking
{
  frames: 10,
  duration: 1,
  start: 0,
  width: 18,
  height: 15
},
//hidden, horizontal movement
{
  frames: 1,
  duration: 1,
  start: -1,
  width: 18,
  height: 15
}
];

const ISAAC_WALK_EAST_SPRITEMAP = [
//hidden
{
  frames: 1,
  duration: 1,
  start: -1,
  width: 18,
  height: 14
},
//walking
{
  frames: 10,
  duration: 1,
  start: 0,
  width: 18,
  height: 14
}];


//spriteAnimator class
function spriteAnimator(spritemap, element, verticallyAnimated) {
  this.spritemap = spritemap;
  this.element = element;
  this.verticallyAnimated = verticallyAnimated;
  this.mirrored = false;
  this.selection = 0;
  this.animTime = 0;

  this.update();
}

spriteAnimator.prototype.update = function() {
  while (this.animTime >= this.spritemap[this.selection].duration) this.animTime -= this.spritemap[this.selection].duration;
  while (this.animTime < 0) this.animTime += this.spritemap[this.selection].duration;

  //we need to find what frame we're on, based on spritemap's frames and duration vs animTime
  //sptmp.frames / sptmp.duration = frame changes/sec
  //floor fps * animTime = what frame we're on

  let offset = (this.spritemap[this.selection].start + 
    Math.floor((this.spritemap[this.selection].frames / this.spritemap[this.selection].duration) * this.animTime)) * -1;
  
  //then we need to find the offset in multiples of width/height, mirror if verticallyAnimated
  if(this.verticallyAnimated) {
    offset = offset * this.element.clientHeight;
    this.element.firstElementChild.style.top = offset + "px";
    if(this.mirrored) {this.element.firstElementChild.style.transform = "scaleX(-1)";}
    else {this.element.firstElementChild.style.transform = "scaleX(1)";}
  } else {
    offset *= this.element.clientWidth;
    this.element.firstElementChild.style.left = offset + "px";
  }
};


let head = document.getElementById("head");
let box = document.getElementById("body");
let bodyEast = document.getElementById("body-east");

let headAnimator = new spriteAnimator(ISAAC_HEAD_SPRITEMAP, head, false);
let bodyAnimator = new spriteAnimator(ISAAC_WALK_SPRITEMAP, box, false);
let bodyEastAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEast, true);

box.style.left = Math.floor(Math.random() * (window.innerWidth - box.clientWidth)) + "px";
box.style.top = Math.floor(Math.random() * (window.innerHeight - box.clientHeight)) + "px";

let boxRect = box.getBoundingClientRect();

head.style.top = boxRect.top + -60 + "px";
head.style.left = boxRect.left + -15 + "px";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////MAIN LOOP///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let mousePos;
document.addEventListener("mousemove", (e) => {mousePos = e;});

let vX = 0; let vY = 0;

function loop() {
  if (!mousePos) return;
  
  let hWidth = box.clientWidth * 0.5;
  let hHeight = box.clientHeight * 0.5;
  boxRect = box.getBoundingClientRect();
  let boxCenterX = boxRect.left + hWidth;
  let boxCenterY = boxRect.top + hHeight;
  
  if ((boxCenterX - mousePos.clientX)**2 + (boxCenterY - mousePos.clientY)**2 < hHeight**2) {
    //slowly stop
    headAnimator.selection = 0;
    headAnimator.animTime = 0;
    headAnimator.update();
    
    bodyAnimator.selection = 0;
    bodyAnimator.animTime = 0;
    bodyAnimator.update();
    
    bodyEastAnimator.selection = 0;
    bodyEastAnimator.animTime = 0;
    bodyEastAnimator.update();
    
    
  } else {
    //move towards goal
    bodyEastAnimator.mirrored = false;
    
    //back to square one...

    
    //animate!
    //horizontal dominated
    if(Math.abs(vX) > Math.abs(vY)) {
      bodyAnimator.selection = 2;
      bodyAnimator.animTime = 0;
      bodyEastAnimator.selection = 1;
      bodyEastAnimator.animTime += FRAMERATE;
      if (intersect.x > 0) {headAnimator.selection = 1;}
      else {headAnimator.selection = 3;}
    }
    //vertical dominated
    else {
      bodyEastAnimator.selection = 0;
      bodyEastAnimator.animTime = 0;
      bodyAnimator.selection = 1;
      if (vY > 0) {
        headAnimator.selection = 0;
        bodyAnimator.animTime += FRAMERATE;
      }
      else {
        headAnimator.selection = 2;
        bodyAnimator.animTime -= FRAMERATE;
      }
    }
  }

  //after everything, add velocity
  box.style.left = boxRect.left + vX + "px";
  box.style.top = boxRect.top + vY + "px";

  boxRect = box.getBoundingClientRect();

  
  bodyEast.style.top = boxRect.top + "px";
  bodyEast.style.left = boxRect.left + "px";

  //snap isaac's head
  //isaac head hight = 25px
  //isaac idle body height = 13px
  head.style.top = boxRect.top + -60 + "px";
  //isaac head width = 28px
  //isaac idle body width = 18px
  head.style.left = boxRect.left + -15 + "px";

  bodyAnimator.update();
  bodyEastAnimator.update();
  headAnimator.update();
  
}
  

function swallow() {
  if (Math.floor(Math.random() * 20) == 0) {
    head.firstElementChild.src = "/vurp/img/isaac-head-pills-sheet.png";
    new Audio("/vurp/sfx/derp.wav").play();
  } else {
    new Audio("/vurp/sfx/vurp.x-wav").play();
  }
}

document.querySelectorAll("div").forEach((v) => {v.addEventListener("click", swallow);});

setInterval(loop, FRAMERATE * 1000);
