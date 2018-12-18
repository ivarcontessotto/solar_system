"use strict";

// Define camera control with keyboard.
const MOVE_FORWARD = 87;    // W
const MOVE_BACKWARD = 83;   // S
const ROTATE_LEFT = 65;     // A
const ROTATE_RIGHT = 68;    // S
const ROLL_FORWARD = 38;    // forward arrow
const ROLL_BACKWARD = 40;   // backward arrow
const ROLL_LEFT = 37;       // left arrow
const ROLL_RIGHT = 39;      // right arrow

function Controller(model, view) {
    this.keysPressed = {};
    this.keysPressed[MOVE_FORWARD] = 0;
    this.keysPressed[MOVE_BACKWARD] = 0;
    this.keysPressed[ROTATE_LEFT] = 0;
    this.keysPressed[ROTATE_RIGHT] = 0;
    this.keysPressed[ROLL_FORWARD] = 0;
    this.keysPressed[ROLL_BACKWARD] = 0;
    this.keysPressed[ROLL_LEFT] = 0;
    this.keysPressed[ROLL_RIGHT] = 0;

    this.model = model;
    this.view = view;
    this.startTime = null;
}

Controller.prototype.run = function() {

    const onKeyDown = (event) => {
        this.keysPressed[event.keyCode] = 1;
    };

    const onKeyUp = (event) => {
        this.keysPressed[event.keyCode] = 0;
    };

    const seconds = (runtime) => runtime / 1000;

    const startAnimation = (timeStamp) => {
        this.startTime = timeStamp;
        window.requestAnimationFrame(animate);
    };

    const animate = (timeStamp) => {
        this.model.update(seconds(timeStamp - this.startTime), this.keysPressed);
        this.view.draw();
        this.startTime = timeStamp;
        window.requestAnimationFrame(animate);
    };

    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.requestAnimationFrame(startAnimation);
};