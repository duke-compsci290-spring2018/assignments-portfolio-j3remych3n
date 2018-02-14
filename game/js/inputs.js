/*
 * Key and mouse input manager
 */
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

export { InputManager };