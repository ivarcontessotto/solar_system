"use strict";


function Controller(model, view) {

    this.key = {
        pressed: {},
        // Defines key functions
        FORWARD_BOOST: 87,      // W
        BACKWARD_BOOST: 83,     // S
        ROLL_LEFT: 65,          // A
        ROLL_RIGHT: 68,         // F
        ROTATE_UP: 38,          // backward arrow
        ROTATE_DOWN: 40,        // forward arrow
        ROTATE_LEFT: 37,        // left arrow,
        ROTATE_RIGHT: 39,       // right arrow
    };
    this.key.pressed[this.key.FORWARD_BOOST] = 0;
    this.key.pressed[this.key.BACKWARD_BOOST] = 0;
    this.key.pressed[this.key.ROTATE_RIGHT] = 0;
    this.key.pressed[this.key.ROTATE_LEFT] = 0;
    this.key.pressed[this.key.ROTATE_DOWN] = 0;
    this.key.pressed[this.key.ROTATE_UP] = 0;
    this.key.pressed[this.key.ROLL_LEFT] = 0;
    this.key.pressed[this.key.ROLL_RIGHT] = 0;

    this.model = model;
    this.view = view;
    this.startTime = null;
}

Controller.prototype.run = function() {

    const onKeyDown = (event) => {
        this.key.pressed[event.keyCode] = 1;
    };

    const onKeyUp = (event) => {
        this.key.pressed[event.keyCode] = 0;
    };

    const seconds = (runtime) => runtime / 1000;

    const startAnimation = (timeStamp) => {
        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    const animateFrame = (timeStamp) => {
        // todo kind of ugly.
        this.model.update(
            seconds(timeStamp - this.startTime),
            [
                // Order is critical
                this.key.pressed[this.key.FORWARD_BOOST],
                this.key.pressed[this.key.BACKWARD_BOOST],
                this.key.pressed[this.key.ROLL_LEFT],
                this.key.pressed[this.key.ROLL_RIGHT],
                this.key.pressed[this.key.ROTATE_UP],
                this.key.pressed[this.key.ROTATE_DOWN],
                this.key.pressed[this.key.ROTATE_LEFT],
                this.key.pressed[this.key.ROTATE_RIGHT]
            ]);

        this.view.draw();

        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.requestAnimationFrame(startAnimation);
};