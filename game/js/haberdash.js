/*
* @author Jeremy Chen (j587)
* 
* Haberdash! A simple game made for Duke course CS 290.02: Web App. Development
*
* Images and other assets are created and owned by me. All rights reserved. 
* Font "Neuzeit Grotesk Light" published by URW++, designed by Wilhelm Pischner. I claim no ownership ofthis font.
*
*/
/*jshint esversion: 6 */

// Useful constants
const TEXT_COLOR = '#D7D2CB';
const FPS = 60;
const WINDOW_SIZE = 1920;
const WIN_THRESHOLD = 20;
const LOSE_THRESHOLD = 10;
const WIN = "WIN";
const LOSE = "LOSE";
const IN_GAME = "IN_GAME";
const WAITING = "WAITING";
var GAME_STATE = WAITING;

const HAT_SPAWN_PROBABILITY = 0.0075;
const HAT_W = 400;
const HAT_H = parseInt(HAT_W/1.6);
const HAT_SPEED = 5;
const HAT_URI = "assets/hats/";
const HAT_IMGS = ['0.png', '1.png', '2.png', '4.png', '5.png', '6.png'];
const HAT_SPAWN_Y = 0;

const HABER_SPEED = 15;
const HABER_W = 250;
const HABER_H = 357;
const HABER_PADDING = 50;
const HABER_URI = "assets/haberdasher/";
const HABER_IMGS = ["Moving_Left.png", "low_0.png", "Moving_Right.png", "Stationary_Right.png"];
const HOVER_IMGS = ["low_0.png", "low_1.png", "low_2.png", "low_3.png"];
const HABER_Y = parseInt(WINDOW_SIZE * 0.6875);
const HABER_X = parseInt((WINDOW_SIZE - HABER_W)/2);

const COLLECTED_X = 660;
const DROPPED_X = 1620;
const SCORE_Y = 1870;

var haberdash;
// Scoring & progression

/*
 * Importing classes
 */
/*
 * Generic game element that can move and be drawn on the canvas. 
 * Taken from Duvall's sample code, some modifications
 */
class Sprite {
    constructor (x, y, width, height, dx, dy) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
    }

    get x () {
        return this._x;
    }

    get y () {
        return this._y;
    }

    get dx () {
        return this._dx;
    }

    get dy () {
        return this._dy;
    }

    get nextX () {
        return this._x + this._dx;
    }

    get nextY () {
        return this._y + this._dy;
    }

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }

    set x (x) {
        this._x = x;
    }

    set y (y) {
        this._y = y;
    }

    set dx (dx) {
        this._dx = dx;
    }

    set dy (dy) {
        this._dy = dy;
    }

    set width (w) {
        this._width = w;
    }

    set height (h) {
        this._height = h;
    }

    reset () {
        this.x = this.startX;
        this.y = this.startY;
    }

    move (canvas) {
        
    }

    draw (ctx) {
        
    }
}

/*
 * Image and Sound manager
 */

// handle image and sounds loading, really only needed for LOTS or BIG images and sounds
class ResourceManager {
    constructor () {
        this.numImagesLeftToLoad = 0;
        this.numSoundsLeftToLoad = 0;
    }

    loadImage (url) {
        // create actual HTML element and note when it finishes loading
        var img = new Image();
        var self = this;
        img.onload = function () {
            self.numImagesLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.onload = null;
        };
        img.onerror = function () {
            console.log('ERROR: could not load ' + url);
        };
        img.src = url;
        this.numImagesLeftToLoad += 1;
        return img;
    }
    
    loadImageSeq (uri, filenames){
        var imgs = [];
        for(let i of filenames){
            var img = this.loadImage(uri + i);
            if (this.isLoadingComplete()) {
                imgs.push(img);
            }
        }
        return imgs;
    }

    loadSound (url) {
        // create actual HTML element and note when it finishes loading
        var snd = new Audio();
        var self = this;
        snd.oncanplay = function () {
            self.numSoundsLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.oncanplay = null;
        };
        snd.onerror = function () {
            console.log('ERROR: could not load ' + url);
        };
        snd.src = url;
        this.numSoundsLeftToLoad += 1;
        return snd;
    }

    isLoadingComplete () {
        return this.numImagesLoaded === this.numImagesExpected &&
               this.numSoundsLoaded === this.numSoundsExpected;
    }
}

// manages key input
class InputManager {
    constructor (canvas) {
        this.canvas = canvas;
        this.rightPressed = false;
        this.leftPressed = false;        
        this.rPressed = false;
        this.wPressed = false;
        this.hPressed = false;
        this.enterPressed = false;
    }

    get leftPressed () {
        return this._leftPressed;
    }
    get rightPressed () {
        return this._rightPressed;
    }
    get rPressed () {
        return this._rPressed;
    }
    get wPressed () {
        return this._wPressed;
    }
    get hPressed () {
        return this._hPressed;
    }
    get enterPressed () {
        return this._enterPressed;
    }
    
    set leftPressed (k) {
        this._leftPressed = k;
    }
    set rightPressed (k) {
        this._rightPressed = k;
    }
    set rPressed (k) {
        this._rPressed = k;
    }
    set wPressed (k) {
        this._wPressed = k;
    }
    set hPressed (k) {
        this._hPressed = k;
    }
    set enterPressed (k) {
        this._enterPressed = k;
    }

    keyDownHandler (e) {
        switch(e.keyCode) {
            case 37:
                this.leftPressed = true;
                break;
            case 39:
                this.rightPressed = true;
                break;
            case 87:
                this.wPressed = true;
                break;
            case 82:
                this.rPressed = true;
                break;
            case 72:
                this.hPressed = true;
                break;
            case 13:
                this.enterPressed = true;
                break;
        }
    }

    keyUpHandler (e) {
        switch(e.keyCode) {
            case 37:
                this.leftPressed = false;
                break;
            case 39:
                this.rightPressed = false;
                break;
            case 87:
                this.wPressed = false;
                break;
            case 82:
                this.rPressed = false;
                break;
            case 72:
                this.hPressed = false;
                break;
            case 13:
                this.enterPressed = false;
                break;
        }
    }
}

// Object to represent the haberdasher
class HaberDasher extends Sprite{
    constructor(images, xStart, yStart, width, height, xv, hatsStack){
        super(xStart, yStart, width, height, xv, 0);
        this.imgs = images;
        this.img = this.imgs[1];
        this.hats = hatsStack;
    }
    
    move (canvas) {
        if (input.rightPressed && !input.leftPressed && this.x + HABER_PADDING < canvas.width - this.width) {
            this.img = this.imgs[2];
            this.x += this.dx;
        }
        else if (input.leftPressed && this.x - HABER_PADDING > 0) {
            this.img = this.imgs[0];
            this.x -= this.dx;
        }
        else if(!input.rightPressed && !input.leftPressed){
            if(this.img == this.imgs[2]){
                this.img = this.imgs[3];
            }
            else if(this.img == this.imgs[0]){
                this.img = this.imgs[1];
            }
        }
        this.hats.move(canvas);
    }
    
    set hats(hs){
        this._hats = hs;
    }
    
    get hats(){
        return this._hats;
    }
    
    draw (ctx) {
        ctx.drawImage(this.img, this.x, this.y, HABER_W, HABER_H);
        this.hats.draw(ctx);
    }
}

// Object that serves as a wrapper for the list of hats on the haberdashers head
class HatStack {

    constructor(maxHats){
        this.limit = maxHats;
        this.hatList = [];
    }
    
    reachTheRoof(){
        return (this.hatList.length >= this.limit);
    }
    
    add(hat){
        this.hatList.push(hat);
    }
    
    height(){
        return parseInt(0.3*HAT_H*(this.hatList.length) + HABER_H - 50);
    }
    
    size(){
        return this.hatList.length;
    }
    
    win(){
        return this.size() >= this.limit;
    }
    
    draw (ctx){
        for(let h of this.hatList){
            h.draw(ctx);
        }
    }
    
    move (canvas){
    }
}

// Object to represent a singular Hat
class Hat extends Sprite{
    constructor(xStart, imgs){
        super(xStart, HAT_SPAWN_Y, HAT_W, HAT_H, -400, HAT_SPEED);
        this.img = imgs[parseInt(Math.random() * imgs.length)];
        this.onHead = false;
        this.onGround = false;
    }
        
    set onHead(oh){
        this._onHead = oh;
    }
    
    get onHead(){
        return this._onHead;
    }
    
    get onGround (){
        return this._onGround;
    }
    
    set onGround (og){
        this._onGround = og;
    }
    
    move (canvas) {
        this.onGround = this.nextY > 1400;
        if(!this.onGround){
            if(this.onHead){
                this.dx = HABER_SPEED;
                if (input.rightPressed && !input.leftPressed && haberdash.x + HABER_PADDING < canvas.width - HABER_W) {
                    this.x += this.dx;
                }
                else if (input.leftPressed && haberdash.x - HABER_PADDING > 0) {
                    this.x -= this.dx;
                }
            }
            else if (this.y <= HABER_Y + HAT_H/2){
                if (this.y < canvas.height - this.height) {
                    this.y += this.dy;
                }
                else if (this.y > 0) {
                    this.y -= this.dy;
                }
            }
        }
    }
    
    draw (ctx) {
        ctx.drawImage(this.img, this.x, this.y, HAT_W, HAT_H);
    }
}

// serves Splash screens
class Splash extends Sprite{
    constructor (img){
        super(0,0,0,0,0,0);
        this.splash = img;
    }

    draw (ctx) {
        ctx.drawImage(this. splash, 0, 0, WINDOW_SIZE, WINDOW_SIZE);
    }
}

// serves scores
class Score extends Sprite {
    constructor (x, y) {
        super(x, y, 0, 0, 0, 0);
        this.score = 0;
    }
    
    get score(){
        return this._score;
    }
    
    set score(s){
        this._score = s;
    }
    
    draw (ctx) {
        ctx.font = '120px n_g';
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.score, this.x, this.y);
    }

    reset () {
        this.score = 0;
    }

    increment () {
        this.score += 1;
    }
}

// Essentailly a splash screen for hte welcome menu, contains deprecated hover animation
class Start extends Sprite{
    constructor (hs, ss){
        super(0,0,0,0,0,0);
        this.hoverSeq = hs;
        this.START_SPLASH = ss;
        this.hoverImg = this.hoverSeq[0];
    }

    draw (ctx) {
        this.hover();
        ctx.drawImage(this.START_SPLASH, 0, 0, WINDOW_SIZE, WINDOW_SIZE);
    }

    hover(){
        if(this.hoverCount >= 3){
            this.hoverUp = false;
        }
        else if(this.hovercount <= 0){
            this.hoverUp = true;
        }
        if(this.hoverUp){
            this.hoverCount++;
        }
        else{
            this.hoverCount--;
        }
        this.hoverImg = this.hoverSeq[this.hoverCount];
    }
    
}

/*
 * Game class contains everything about the game and displays in a given canvas
 */
class Game {
    constructor (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        
        this.collected = new Score(COLLECTED_X, SCORE_Y);
        this.dropped = new Score(DROPPED_X, SCORE_Y);
        
        this.liveHats = [];
        this.droppedHats = 0;
        
        this.hats = new HatStack(WIN_THRESHOLD);
        this.HOVER_SEQ = resources.loadImageSeq(HABER_URI, HOVER_IMGS);
        this.START_SPLASH = resources.loadImage("assets/start_message.png");
        this.dashers = resources.loadImageSeq(HABER_URI, HABER_IMGS);
        this.hatImgs = resources.loadImageSeq(HAT_URI, HAT_IMGS);
        haberdash = new HaberDasher(this.dashers, HABER_X, HABER_Y, HABER_W, HABER_H, HABER_SPEED, this.hats);
        this.LOSE_SPLASH = resources.loadImage("assets/lose.png");
        this.WIN_SPLASH = resources.loadImage("assets/win.png");
        this.hoverHelper = new Start(this.HOVER_SEQ, this.START_SPLASH);
    }
    
    reset(){
        this.liveHats = [];
        this.droppedHats = 0;
        this.hats = new HatStack(WIN_THRESHOLD);
        haberdash = new HaberDasher(this.dashers, HABER_X, HABER_Y, HABER_W, HABER_H, HABER_SPEED, this.hats);
        this.hoverHelper = new Start(this.HOVER_SEQ, this.START_SPLASH);
    }
    
    set droppedHats(dh){
        this._droppedHats = dh;
    }
    
    get droppedHats(){
        return this._droppedHats;
    }
    
    get haberdash() {
        return this._haberdash;
    }
    
    set haberdash(h) {
        this._haberdash = h;
    }
    
    loop () {
        if (resources.isLoadingComplete()) {
            this.update();
            this.draw();
        }
    }

    update() {
        this.collected.score = haberdash.hats.size();
        this.dropped.score = this.droppedHats;
        if(haberdash.hats.size()>=20) {
            GAME_STATE = WIN;
        }
        else if(this.dropped.score >= LOSE_THRESHOLD){
            GAME_STATE = LOSE;
        }
        else{
            this.hatGenerator(HAT_SPAWN_PROBABILITY, this.ctx);
            haberdash.move(this.canvas);
            for(let h of this.liveHats){
                h.move(this.canvas);
            }
            this.checkCollisions(this.canvas);
            console.log("on head:" + haberdash.hats.size() + " live: " + this.liveHats.length +" dead: " + this.droppedHats);           
        }
    }
    
    hover(){
        if (resources.isLoadingComplete()){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.hoverHelper.draw(this.ctx);
        }
    }
    
    win(){
        this.splash(this.WIN_SPLASH);
    }
    
    lose(){
        this.splash(this.LOSE_SPLASH);
    }
    
    splash(img){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var splash = new Splash(img);
        splash.draw(this.ctx);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let h of this.liveHats){
            h.draw(this.ctx);
        }
        haberdash.draw(this.ctx);
        this.collected.draw(this.ctx);
        this.dropped.draw(this.ctx);
    }


    checkCollisions() {
        for(let hat of this.liveHats){
            if (hat.onGround) {
                console.log("hwhat");
                hat.dy = 0;
                hat.dx = 0;
                this.droppedHats++;
            }
            else if(!hat.onHead && hat.y<1400 && hat.nextY + 1.5*hat.height >= WINDOW_SIZE - (haberdash.hats.height()) - 100 && hat.x + HAT_W/3 < haberdash.x + HABER_W && hat.x + 0.6*HAT_W > haberdash.x){
                console.log("hit head");
                hat.onHead = true;
                haberdash.hats.add(hat);
            }
        }
    }
    
    hatGenerator(probability, ctx) {
        if(Math.random()<probability){
            var x = parseInt((WINDOW_SIZE - 500)*(Math.random()))+40;
            var hat = new Hat(x, this.hatImgs);
            this.liveHats.push(hat);
        }   
    }
}

/*
 * Setup classes
 */
var canvas = document.getElementById('gameCanvas');
var resources = new ResourceManager();
var input = new InputManager(canvas);
var game = new Game(canvas);

/*
 * Setup input responses
 * respond to both keys and mouse movements
 */
document.addEventListener('keydown', event => input.keyDownHandler(event), false);
document.addEventListener('keyup', event => input.keyUpHandler(event), false);
            
/*
 * Game loop
 */
setInterval(function() {
    
    if(input.wPressed){
        GAME_STATE = WIN;
    }
    else if(input.rPressed){
        game.reset();
    }
    else if(input.hPressed){
        game.droppedHats = 0;
    }
    
    switch(GAME_STATE){
        case WIN:
            game.win();
            if(input.enterPressed){
                game.reset();
                GAME_STATE = IN_GAME;
            }
            break;
        case LOSE:
            game.lose();
            if(input.enterPressed){
                game.reset();
                GAME_STATE = IN_GAME;
            }
            break;
        case WAITING:
            if(input.enterPressed){
                GAME_STATE = IN_GAME;
            }
            game.hover();
            break;
        case IN_GAME:
            game.loop();
            break;
    }
}, 1000/FPS);
