/*
* @author Jeremy Chen (j587)
* 
* All images and other assets are created and owned by me. All rights reserved.
*/

// Useful constants
const HAT_SPAWN_THRESHOLD = 3;
const HAT_SPEED = 10;
const HABERDASHER_SPEED = 15;
const HABER_URI = "assets/haberdasher/";
const HAT_URI = "assets/hats/";
const HABER_IMGS = ["Moving_Left.png", "Stationary_Left.png", "Moving_Right.png", "Stationary_Right.png"];
const HOVER_IMGS = ["low.png", "low_0.png", "low_1.png", "low_2.png"];

// Scoring & progression
var liveHats = [];
var droppedHats = [];
var numCollected = 0;
var numDropped = 0;

// Sprites & splashes
var haberdasher = new Image();
const WIN_SPLASH = new Image(1000,1000);
WIN_SPLASH.src = "assets/win.png";
const LOSE_SPLASH = new Image(1000,1000);
LOSE_SPLASH.src = "assets/lose.png";
const START_SPLASH = new Image(1000, 1000);
START_SPLASH.src = "assets/start_message.png";

// Canvas & context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();

//ctx.drawImage(WIN_SPLASH, 0, 0, 1000, 1000);
//ctx.drawImage(LOSE_SPLASH, 0, 0, 1000, 1000);
ctx.drawImage(START_SPLASH, 0, 0, 1000, 1000);

//function fadeIn(img, x, y) {
//  el.style.opacity = 0;
//
//
//  var tick = function() {
//    el.style.opacity = +el.style.opacity + 0.01;
//
//
//    if (+el.style.opacity < 1) {
//      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
//    }
//  };
//
//  tick();
//}
//
//fadeIn(el);

//
//
//;(function () {
//  function main( tFrame ) {
//    MyGame.stopMain = window.requestAnimationFrame( main );
//    
//    update( tFrame ); //Call your update method. In our case, we give it rAF's timestamp.
//    render();
//}
//
//  
//  main(); // Start the cycle
//})();