"use strict";


function Controller(model, view) {

    this.key = {
        pressed: {},
        STRAFE_RIGHT: 68,
        STRAFE_LEFT: 65,
        FORWARD: 87,
        BACKWARD: 83
    };
    this.key.pressed[this.key.STRAFE_RIGHT] = 0;
    this.key.pressed[this.key.STRAFE_LEFT] = 0;
    this.key.pressed[this.key.FORWARD] = 0;
    this.key.pressed[this.key.BACKWARD] = 0;

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
        // todo Check key pressed and do something with it.
        this.model.update(
            seconds(timeStamp - this.startTime),
            [
                this.key.pressed[this.key.STRAFE_RIGHT],
                this.key.pressed[this.key.STRAFE_LEFT],
                this.key.pressed[this.key.FORWARD],
                this.key.pressed[this.key.BACKWARD]
            ]);
        this.view.draw();

        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('keydown', onKeyDown, false);
    window.requestAnimationFrame(startAnimation);
};