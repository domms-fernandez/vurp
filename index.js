const ISAAC_SCALE = 3; //scale isaac's sprites by this much
const ISAAC_SPEED = 10; //how many multiples of its own height the body box will move/sec
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

let boxRect = box.getBoundingClientRect(); //we use this later

head.style.top = boxRect.top + -60 + "px";
head.style.left = boxRect.left + -15 + "px";


let mousePos;
let vX = 0; let vY = 0;


function loop() {
  if (!mousePos) return;
  
}
  

//how does swallowing pills work?
function swallow() {
  if (Math.floor(Math.random() * 20) == 0) {
    head.firstElementChild.src = "/vurp/img/isaac-head-pills-sheet.png";
    new Audio("/vurp/sfx/derp.wav").play();
  } else {
    new Audio("/vurp/sfx/vurp.x-wav").play();
  }
}

document.querySelectorAll("div").forEach((v) => {v.addEventListener("click", swallow);});
document.addEventListener("mousemove", (e) => {mousePos = e;});

setInterval(loop, FRAMERATE * 1000);
