//consts
const ISAAC_SPEED = 5; //how many multiples of its own height the body box will move/sec
const FRAMERATE = 0.017; //one divided by FPS

const MAX_PILL_HOLD_TIME = 1; //isaac holds pill up for this long before it is stashed
const PILL_SEED = Math.floor(Math.random() * 13); //pill sheet offset

const IDLE_TIMEOUT = 60; //when idle for _ seconds, isaac grabs pills on his own

const CHAR_LIST = [
  {
    str: "isaac", exLifeScale: {
      width: 60,
      height: 63,
      left: -30,
      top: -31.5
    }
  },
  {
    str: "bb", exLifeScale: {
      width: 69,
      height: 78,
      left: -34.5,
      top: -39
    }
  }
];

const ALL_PILLS_SPRITEMAP = [
{
  frames: 13,
  duration: 13,
  start: 0
}
];

const ISAAC_HURT_SPRITEMAP = [
//hidden
{
  frames: 1,
  duration: 1,
  start: -1
},
//dying
{
  frames: 4,
  duration: 0.53,
  start: 0
},
//dead
{
  frames: 1,
  duration: 1,
  start: 3
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
let favicon = document.querySelectorAll("link")[1];

let dice = document.getElementById("dice");

let isaacHurtPositioner = document.getElementById("isaac-hurt-positioner");
let isaacHurtScaler = document.getElementById("isaac-hurt-scaler");
let isaacHurt = document.getElementById("isaac-hurt");

let isaacPositioner = document.getElementById("isaac-positioner");
isaacPositioner.style.left = Math.floor(Math.random() * (window.innerWidth - 84)) + "px";
isaacPositioner.style.top = Math.floor(Math.random() * (window.innerHeight - 105)) + "px";

let isaacScaler = document.getElementById("isaac-scaler");

let head = document.getElementById("head");
let body = document.getElementById("body");
let bodyEast = document.getElementById("body-east");

let headHold = document.getElementById("head-hold");
let bodyHold = document.getElementById("body-hold");
let bodyEastHold = document.getElementById("body-east-hold");

let pillPositioner = document.getElementsByClassName("pill-positioner")[0];
let pill = pillPositioner.firstElementChild;

let fakePillPositioner = document.getElementsByClassName("pill-positioner")[1];
let fakePill = fakePillPositioner.firstElementChild;

let exLifePositioner = document.getElementById("ex-life-positioner");
let exLife = document.getElementById("ex-life");

//create animators
let isaacHurtAnimator = new spriteAnimator(ISAAC_HURT_SPRITEMAP, isaacHurt, false);

let headAnimator = new spriteAnimator(ISAAC_HEAD_SPRITEMAP, head, false);
let bodyAnimator = new spriteAnimator(ISAAC_WALK_SPRITEMAP, body, false);
let bodyEastAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEast, true);

let headHoldAnimator = new spriteAnimator(ISAAC_HEAD_HOLD_SPRITEMAP, headHold, false);
let bodyHoldAnimator = new spriteAnimator(ISAAC_WALK_HOLD_SPRITEMAP, bodyHold, false);
let bodyEastHoldAnimator = new spriteAnimator(ISAAC_WALK_EAST_SPRITEMAP, bodyEastHold, true);

let pillAnimator = new spriteAnimator(ALL_PILLS_SPRITEMAP, pill, false);
let fakePillAnimator = new spriteAnimator(ALL_PILLS_SPRITEMAP, fakePill, false);

pillAnimator.animTime = PILL_SEED;
pillAnimator.update();

//SFX
let pickupSFX = new Audio("/vurp/sfx/pickup.mp3");
let vurpSFX = new Audio("/vurp/sfx/vc/vurp.wav");
let badTripSFX = new Audio("/vurp/sfx/vc/bad-trip.wav");
let percsSFX = new Audio("/vurp/sfx/vc/percs.wav");
let derpSFX = [
  new Audio("/vurp/sfx/derp.wav"),
  new Audio("/vurp/sfx/derp-alt.wav")
];
let hurtSFX = [
  new Audio("/vurp/sfx/isaac/hurt0.wav"),
  new Audio("/vurp/sfx/isaac/hurt1.wav"),
  new Audio("/vurp/sfx/isaac/hurt2.wav")
];
let dieSFX = [
  new Audio("/vurp/sfx/isaac/die0.wav"),
  new Audio("/vurp/sfx/isaac/die1.wav"),
  new Audio("/vurp/sfx/isaac/die2.wav")
];


//characters!!!
let characterSelection = 0;

function changeCharacter(selection) {
  characterSelection = selection;

  exLife.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/1up.png`;
  exLife.width = CHAR_LIST[characterSelection].exLifeScale.width;
  exLife.height = CHAR_LIST[characterSelection].exLifeScale.height;
  exLife.top = CHAR_LIST[characterSelection].exLifeScale.top;
  exLife.left = CHAR_LIST[characterSelection].exLifeScale.left;

  head.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/head-sheet.png`;
  body.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/body-sheet.png`;
  bodyEast.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/body-east-sheet.png`;

  headHold.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/head-hold.png`;
  bodyHold.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/body-hold-sheet.png`;
  bodyEastHold.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/body-east-hold-sheet.png`;
}

if(!Math.floor(Math.random() * 4)) changeCharacter(Math.floor(Math.random() * (CHAR_LIST.length - 1)) + 1); //i in 4 chance to not be the 'saac
isaacHurt.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/hurt-sheet.png`; //1 of 2 time we have to manually do this


//global vars
let idleTime = 0;
let mousePos;
document.addEventListener("mousemove", (e) => {idleTime = 0; mousePos = e;});

let mouseGone = false;

let pillX = 28.5 + Math.floor(Math.random() * (window.innerWidth - 57));
let pillY = 28.5 + Math.floor(Math.random() * (window.innerHeight - 57));
pillPositioner.style.left = pillX - 28.5 + "px";
pillPositioner.style.top = pillY - 28.5 + "px";

let pillOffset = 0;

let holding = false;
let holdTime = MAX_PILL_HOLD_TIME;
let pillCanBeHeld = true;
let holdingExLife = false;

let dead = false;

let vX = 0; let vY = 0;


//main loop
function loop() {
  
  //if we're dead
  if(dead) {
    let deathAnimProgress = isaacHurtAnimator.animTime + FRAMERATE;
    if(deathAnimProgress < ISAAC_HURT_SPRITEMAP[1].duration) isaacHurtAnimator.animTime = deathAnimProgress;
    else isaacHurtAnimator.selection = 2;
    isaacHurtAnimator.update();
    
    return;
  }

  //handle idling
  if (idleTime < IDLE_TIMEOUT) {
    idleTime += FRAMERATE;
  }
  
  if (idleTime > IDLE_TIMEOUT) {
    idleTime = IDLE_TIMEOUT;
    if(holding) swallow();
    mousePos = {x: pillX, y: pillY};
  }

  let delayedPillX = pillX;
  let delayedPillY = pillY;
  if(idleTime >= IDLE_TIMEOUT) setTimeout(() => {if(idleTime >= IDLE_TIMEOUT) mousePos = {x: delayedPillX, y: delayedPillY};}, 1000);
  
  if (!mousePos) return;
  
  //define some more consts to make our lives easier
  let isaacPosition = isaacPositioner.getBoundingClientRect();
  const HALF_BODY_HEIGHT = 22.5;
  const CENTER_BODY_X = 42 + isaacPosition.left;
  const CENTER_BODY_Y = 82.5 + isaacPosition.top;

  //grabbing pill
  if(!holding && pillCanBeHeld && (pillX - CENTER_BODY_X)**2 + (pillY - CENTER_BODY_Y)**2 < (HALF_BODY_HEIGHT + 28.5)**2) {
    holdingExLife = false;
    holding = true;
    holdTime = 0;

    let grabbedPill = PILL_SEED + pillOffset;
    if (grabbedPill >= 13) grabbedPill -= 13;
    favicon.href = "/vurp/img/icon/" + (grabbedPill) + ".ico";
    
    pillPositioner.style.cursor = "auto";
    pill.style.display = "none";

    fakePill.style.display = "block";
    fakePillAnimator.animTime = pillAnimator.animTime; //match the real pill apperance
    fakePillAnimator.update();

    isaacPositioner.style.cursor = "pointer";
    isaacScaler.classList.add("grabbing");

    pickupSFX.play();
  }

  //move + animate isaac
  //if mouse is within body diameter, or mouse is gone
  if((mousePos.x - CENTER_BODY_X)**2 + (mousePos.y - CENTER_BODY_Y)**2 < HALF_BODY_HEIGHT**2 || mouseGone) {
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
  isaacPositioner.style.left = isaacPosition.left + vX * ISAAC_SPEED * FRAMERATE + "px";
  isaacPositioner.style.top = isaacPosition.top + vY * ISAAC_SPEED * FRAMERATE + "px";
  isaacPosition = isaacPositioner.getBoundingClientRect();

  isaacHurtPositioner.style.left = isaacPosition.left + isaacPositioner.clientWidth * 0.5 + "px";
  isaacHurtPositioner.style.top = isaacPosition.bottom + "px";

  fakePillPositioner.style.left = isaacPosition.left + 13.5 + "px";
  fakePillPositioner.style.top = -57 + isaacScaler.getBoundingClientRect().top + "px";

  exLifePositioner.style.left = isaacPosition.left + 42 + "px";
  exLifePositioner.style.top = isaacScaler.getBoundingClientRect().top + CHAR_LIST[characterSelection].exLifeScale.top + "px";

  //update animations
  headAnimator.update();
  bodyAnimator.update();
  bodyEastAnimator.update();

  headHoldAnimator.update();
  bodyHoldAnimator.update();
  bodyEastHoldAnimator.update();

  //if we're holding the 1up or the pill up
  if(holdTime < MAX_PILL_HOLD_TIME) {
    holdTime += FRAMERATE;
    
    if(!holdingExLife) {
      exLife.style.display = "none";
      fakePill.style.display = "block";
    }
    else {
      fakePill.style.display = "none";
      exLife.style.display = "block";
    }
    
    if(holdTime >= MAX_PILL_HOLD_TIME) {
      isaacScaler.classList.add("putting");
      fakePill.style.display = "none";
      exLife.style.display = "none";

      if(holdingExLife) {
        isaacPositioner.className = "";
        holdingExLife = false;
        isaacPositioner.classList.add("respawning");
      }
    }
  }
}
  

//how does swallowing pills work?
function swallow() {
  if(!holding) return;
  holding = false;
  pillCanBeHeld = false;
  isaacPositioner.style.cursor = "auto";
  favicon.href = "/vurp/img/icon/cricket.ico";

  //randomize the pill location
  pillX = 28.5 + Math.floor(Math.random() * (window.innerWidth - 57));
  pillY = 28.5 + Math.floor(Math.random() * (window.innerHeight - 57));
  pillPositioner.style.left = pillX - 28.5 + "px";
  pillPositioner.style.top = pillY - 28.5 + "px";
  
  //pill is displayed, plays drop anim.
  pill.style.display = "block";
  pill.classList.add("falling");
  pillPositioner.style.cursor = "help";
  
  //isaac holds the pill he used. this won't always happen in the future
  holdTime = 0.5 * MAX_PILL_HOLD_TIME;
  isaacScaler.className = "";
  isaacScaler.classList.add("grabbing");

  //handle pill based on offset
  pillHandlers[pillOffset]();

  //new offset
  if(Math.floor(Math.random() * 4)) pillOffset = 0; //3 in 4 chance of just being a vurp!
  else pillOffset = 1 + Math.floor(Math.random() * (pillHandlers.length - 1)); //1 in 4 of being any other pill in pillHandlers
  pillAnimator.animTime = PILL_SEED + pillOffset;
  pillAnimator.update();
}

//pill handlers
let pillHandlers = [
  //vurp
  function() {
    pill.className = "";
    pill.classList.add("spawning");
    vurpSFX.play(); //vurp!
  },
  //bad trip
  function() {
    pill.className = "";
    pill.classList.add("slow-falling");
    holdTime = MAX_PILL_HOLD_TIME;
    fakePill.style.display = "none";
    exLife.style.display = "none";
    
    isaacPositioner.className = "";
    isaacPositioner.style.display = "none";
    changeCharacter(Math.floor(Math.random() * CHAR_LIST.length));
    
    isaacHurtAnimator.selection = 1;
    isaacHurtScaler.classList.add("dying");

    vX = 0;
    vY = 0;
    dead = true;

    //eh! eugh!
    let hurtSFXSelection = Math.floor(Math.random() * 3);
    hurtSFX[hurtSFXSelection].play();
    setTimeout(() => {
      let dieSFXSelection = Math.floor(Math.random() * 3);
      dieSFX[dieSFXSelection].play();
    }, 250);
    setTimeout(() => {badTripSFX.play();}, 1400);
  },
  //percs!
  function() {
    document.body.className = "";
    percsSFX.play(); //percs!
    document.body.classList.add("perced");
  }
];


window.addEventListener("resize", () => {
  let pillPositionerRect = pillPositioner.getBoundingClientRect();
  pillPositioner.style.left = Math.min(pillPositionerRect.left, window.innerWidth - 57) + "px";
  pillPositioner.style.top = Math.min(pillPositionerRect.top, window.innerHeight - 57) + "px";
  pillPositionerRect = pillPositioner.getBoundingClientRect();
  pillX = pillPositionerRect.left + 28.5;
  pillY = pillPositionerRect.top + 28.5;

  let isaacPosition = isaacPositioner.getBoundingClientRect();
  isaacPositioner.style.left = Math.min(isaacPosition.left, window.innerWidth - 84) + "px";
  isaacPositioner.style.top = Math.min(isaacPosition.top, window.innerHeight - 105) + "px";
});

document.addEventListener("mouseleave", () => {mouseGone = true;});
document.addEventListener("mouseenter", () => {mouseGone = false;});

dice.addEventListener("mouseleave", () => {mouseGone = false;});
dice.addEventListener("mouseenter", () => {mouseGone = true;});

dice.addEventListener("click", () => {
  if(holding || !pillCanBeHeld) return;
  
  pill.className = "pill";
  
  pillOffset++;
  if(pillOffset == pillHandlers.length) pillOffset = 0;
    
  pillAnimator.animTime = PILL_SEED + pillOffset;
  pillAnimator.update();
  
  pill.classList.add("spawning");
});

isaacScaler.addEventListener("animationend", (e) => {
  isaacScaler.className = ""; //clear all animation
  if(e.animationName == "put") setTimeout(() => { if(idleTime >= IDLE_TIMEOUT) swallow(); }, 500);
});

//when we're done being dead
isaacHurtScaler.addEventListener("animationend", (e) => {
  isaacHurtScaler.className = ""; //clear all animation
  if(e.animationName == "die") isaacHurtScaler.classList.add("shaking");
  else if(e.animationName == "shake") isaacHurtScaler.classList.add("dead");
  else {
    isaacHurtAnimator.selection = 0;
    isaacHurtAnimator.animTime = 0;
    isaacHurtAnimator.update();
    isaacHurt.firstElementChild.src = `/vurp/img/${CHAR_LIST[characterSelection].str}/hurt-sheet.png`;

    isaacPositioner.style.display = "block";
    isaacPositioner.style.left = Math.floor(Math.random() * (window.innerWidth - 84)) + "px";
    isaacPositioner.style.top = Math.floor(Math.random() * (window.innerHeight - 105)) + "px";

    holdingExLife = true;
    holdTime = 0;
    
    dead = false;
  }
});

pill.addEventListener("animationend", (e) => {
  pill.className = "pill";
  if(e.animationName == "invisible") {
    pill.classList.add("dropping");
    return;
  }
  pillCanBeHeld = true;
});

/*document.body.addEventListener("animationend", (e) => {
  document.body.className = "";
});*/

//pill dragging
function pillDrag() {
  if(holding) return;
  pillX = mousePos.x;
  pillY = mousePos.y;
  pillPositioner.style.left = pillX - 28.5 + "px";
  pillPositioner.style.top = pillY - 28.5 + "px";
}

pillPositioner.addEventListener("mousedown", () => {
  document.addEventListener("mousemove", pillDrag);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", pillDrag);
    }, { once: true });
});

isaacPositioner.addEventListener("click", swallow);
setInterval(loop, FRAMERATE * 1000);

document.getElementById("loading-barrier").remove();
