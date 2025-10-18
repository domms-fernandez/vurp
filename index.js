//consts
const ISAAC_SPEED = 5; //how many multiples of its own height the body box will move/sec
const FRAMERATE = 0.017; //one divided by FPS

const MAX_PILL_HOLD_TIME = 1; //isaac holds pill up for this long before it is stashed
const PILL_SEED = Math.floor(Math.random() * 13); //pill sheet offset

const ALL_PILLS_SPRITEMAP = [
{
  frames: 13,
  duration: 6.7,
  start: 0
}
];

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
},
{
  frames: 1,
  duration: 1,
  start: -1
}
];

const ISAAC_HEAD_HOLD_SPRITEMAP = [
{
  frames: 1,
  duration: 1,
  start: -1
},
{
  frames: 1,
  duration: 1,
  start: 0
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
  duration: 0.8,
  start: 0
},
//hidden, horizontal movement
{
  frames: 1,
  duration: 1,
  start: -1
}
];

const ISAAC_WALK_HOLD_SPRITEMAP = [
//hidden, horizontal movement
{
  frames: 1,
  duration: 1,
  start: -1
},
//idle
{
  frames: 1,
  duration: 1,
  start: 0
},
//walking
{
  frames: 10,
  duration: 0.8,
  start: 0
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
  duration: 0.8,
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


//get elements
let isaacPositioner = document.getElementById("isaac-positioner");
let isaacScaler = document.getElementById("isaac-scaler");

let head = document.getElementById("head");
let body = document.getElementById("body");
let bodyEast = document.getElementById("body-east");

let headHold = document.getElementById("head-hold");
let bodyHold = document.getElementById("body-hold");
let bodyEastHold = document.getElementById("body-east-hold");

let pillPositioner = document.getElementsByClassName("pill-positioner")[0];
let pill = pillPositioner.firstElementChild;

//create animators
let headAnimator = new spriteAnimator(ISAAC_HEAD_SPRITEMAP, head, false);
let bodyAnimator = new spriteAnimator(ISAAC_WALK_SPRITEMAP, body, false);
let bodyEastAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEast, true);

let headHoldAnimator = new spriteAnimator(ISAAC_HEAD_HOLD_SPRITEMAP, headHold, false);
let bodyHoldAnimator = new spriteAnimator(ISAAC_WALK_HOLD_SPRITEMAP, bodyHold, false);
let bodyEastHoldAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEastHold, true);

let pillAnimator = new spriteAnimator(ALL_PILLS_SPRITEMAP, pill, false);


//pill class.. because i need this... okay???
let pill

//global vars
let mousePos;
document.addEventListener("mousemove", (e) => {mousePos = e;});

let vX = 0; let vY = 0;

let holding = false;
let holdTime = MAX_PILL_HOLD_TIME;
let stashed = false;

let pillX = 9.5 + Math.floor(Math.random() * (window.innerWidth - 13));
let pillY = 9.5 + Math.floor(Math.random() * (window.innerHeight - 13));
pill.style.left = pillX - 9.5 + "px";
pill.style.top = pillY - 9.5 + "px";


//main loop
function loop() {
  if (!mousePos) return;
  
  //define some more consts to make our lives easier
  const ISAAC_POSITION = isaacPositioner.getBoundingClientRect();
  const HALF_BODY_HEIGHT = 22.5;
  const CENTER_BODY_X = 42 + ISAAC_POSITION.left;
  const CENTER_BODY_Y = 82.5 + ISAAC_POSITION.top;

  //grabbing pill
  if(!holding && (pillX - CENTER_BODY_X)**2 + (pillY - CENTER_BODY_Y)**2 < (HALF_BODY_HEIGHT + 9.5)**2) {
    holding = true;
    holdTime = 0;
    isaacScaler.className = "";
    isaacScaler.classList.add("grab-class");
    new Audio("pickup.mp3").play();
  }
  if(holdTime < MAX_PILL_HOLD_TIME) {
    if(holding) {
      pill.style.left = ISAAC_POSITION.left + 32.5 + "px";
      pill.style.top = ISAAC_POSITION.top - 13 + "px";
    }
    holdTime += FRAMERATE;
    if(holdTime >= MAX_PILL_HOLD_TIME) {
      isaacScaler.className = "";
      isaacScaler.classList.add("put-class");
      if(holding) {
        stashed = true;
        pill.style.display = "none";
      }
    }
  }

  //move + animate isaac
  //if mouse is within body diameter
  if((mousePos.x - CENTER_BODY_X)**2 + (mousePos.y - CENTER_BODY_Y)**2 < HALF_BODY_HEIGHT**2) {
    vX *= 0.9;
    vY *= 0.9;

    //anim pipeline
    if(holdTime < MAX_PILL_HOLD_TIME) {
      headAnimator.selection = 4;
    
      bodyAnimator.selection = 2;
      bodyAnimator.animTime = 0;
    
      bodyEastAnimator.selection = 0;
      bodyEastAnimator.animTime = 0;
      

      headHoldAnimator.selection = 1;
      
      bodyHoldAnimator.selection = 1;
      bodyHoldAnimator.animTime = 0;
    
      bodyEastHoldAnimator.selection = 0;
      bodyEastHoldAnimator.animTime = 0;
    }
    else {
      headAnimator.selection = 0;
    
      bodyAnimator.selection = 0;
      bodyAnimator.animTime = 0;
    
      bodyEastAnimator.selection = 0;
      bodyEastAnimator.animTime = 0;
      

      headHoldAnimator.selection = 0;
      
      bodyHoldAnimator.selection = 0;
      bodyHoldAnimator.animTime = 0;
    
      bodyEastHoldAnimator.selection = 0;
      bodyEastHoldAnimator.animTime = 0;
    }
  }
  
  //if mouse is outside of body diameter
  else {
    //figure out vX + vY
    let relativeMouseX = mousePos.x - CENTER_BODY_X;
    let relativeMouseY = mousePos.y - CENTER_BODY_Y;

    let radiusRatio = 2 * HALF_BODY_HEIGHT / Math.sqrt(relativeMouseX**2 + relativeMouseY**2);
    let goalVX = relativeMouseX * radiusRatio;
    let goalVY = relativeMouseY * radiusRatio;

    if (goalVX < 0) vX = Math.max(goalVX, vX + goalVX * 0.1);
    else vX = Math.min(goalVX, vX + goalVX * 0.1);
    
    if (goalVY < 0) vY = Math.max(goalVY, vY + goalVY * 0.1);
    else vY = Math.min(goalVY, vY + goalVY * 0.1);

    //anim pipeline
    let absVX = Math.abs(vX);
    let absVY = Math.abs(vY);

    //horizontal dominated
    if(absVX > absVY) {
      //hide
      bodyAnimator.selection = 2;
      bodyAnimator.animTime = 0;
      bodyHoldAnimator.selection = 0;
      bodyHoldAnimator.animTime = 0;

      //holding
      if(holdTime < MAX_PILL_HOLD_TIME) {
        headHoldAnimator.selection = 1; //show
        headAnimator.selection = 4; //hide
        bodyEastAnimator.selection = 0; //hide
        bodyEastHoldAnimator.selection = 1; //walking
        bodyEastHoldAnimator.animTime += FRAMERATE;
        if (vX > 0) bodyEastHoldAnimator.mirrored = false;
        else bodyEastHoldAnimator.mirrored = true;

        bodyEastAnimator.animTime = bodyEastHoldAnimator.animTime;
      }
        
      //not holding
      else {
        headHoldAnimator.selection = 0; //hide
        bodyEastHoldAnimator.selection = 0; //hide
        bodyEastAnimator.selection = 1; //walking
        bodyEastAnimator.animTime += FRAMERATE;
        if (vX > 0) {
          bodyEastAnimator.mirrored = false;
          headAnimator.selection = 1;
        }
        else {
          bodyEastAnimator.mirrored = true;
          headAnimator.selection = 3;
        }

        bodyEastHoldAnimator.animTime = bodyEastAnimator.animTime;
      }
    }
      
    //vertical dominated
    else {
      //hide
      bodyEastAnimator.selection = 0;
      bodyEastAnimator.animTime = 0;
      bodyEastHoldAnimator.selection = 0;
      bodyEastHoldAnimator.animTime = 0;

      //holding
      if(holdTime < MAX_PILL_HOLD_TIME) {
        headAnimator.selection = 4; //hide
        headHoldAnimator.selection = 1; //show
        bodyAnimator.selection = 2; //hide
        bodyHoldAnimator.selection = 2; //walking
        if (vY > 0) bodyHoldAnimator.animTime += FRAMERATE;
        else bodyHoldAnimator.animTime -= FRAMERATE;

        bodyAnimator.animTime = bodyHoldAnimator.animTime;
      }

      //not holding
      else {
        headHoldAnimator.selection = 0; //hide
        bodyHoldAnimator.selection = 0; //hide
        bodyAnimator.selection = 1; //walking
        if (vY > 0) {
          headAnimator.selection = 0;
          bodyAnimator.animTime += FRAMERATE;
        }
        else {
          headAnimator.selection = 2;
          bodyAnimator.animTime -= FRAMERATE;
        }
        
        bodyHoldAnimator.animTime = bodyAnimator.animTime;
      }
    }
  }

  //reposition
  isaacPositioner.style.left = ISAAC_POSITION.left + vX * ISAAC_SPEED * FRAMERATE + "px";
  isaacPositioner.style.top = ISAAC_POSITION.top + vY * ISAAC_SPEED * FRAMERATE + "px";

  //update animations
  headAnimator.update();
  bodyAnimator.update();
  bodyEastAnimator.update();

  headHoldAnimator.update();
  bodyHoldAnimator.update();
  bodyEastHoldAnimator.update();

  pillAnimator.animTime += FRAMERATE;
  pillAnimator.update();
}
  

//how does swallowing pills work?
function swallow() {
  if(!stashed) return;
  if(!Math.floor(Math.random() * 20)) {
    new Audio(["/sfx/derp.wav", "/sfx/derp-alt.wav"][Math.floor(Math.random() * 2)]).play();
    head.src = "/img/isaac-head-pills-sheet.png";
    return;
  }
  holding = false;
  stashed = false;

  //animate accordingly
  isaacScaler.className = "";
  isaacScaler.classList.add("grab-class");
  holdTime = 0.5 * MAX_PILL_HOLD_TIME;

  //logic
  pillX = 9.5 + Math.floor(Math.random() * (window.innerWidth - 13));
  pillY = 9.5 + Math.floor(Math.random() * (window.innerHeight - 13));
  pill.style.left = pillX - 9.5 + "px";
  pill.style.top = pillY - 9.5 + "px";
  pill.style.display = "block";
  
  new Audio("/vurp/sfx/vurp.wav").play();
}

isaacScaler.addEventListener("animationend", () => {
  isaacScaler.className = "";
});

isaacPositioner.addEventListener("click", swallow);
setInterval(loop, FRAMERATE * 1000);
