"use strict";

function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.startTime = null;
    this.inputControl = new InputControl();
}

Controller.prototype.run = function() {

    const seconds = (runtime) => runtime / 1000;

    const produceFrame = (timeStamp) => {
        // todo 1. update the model (decide if paused or not, get speed factor from inputControl)
        this.model.update(seconds(timeStamp - this.startTime), this.activated);
        // todo 2. update the camera (get translation vector and rotation angles from inputControl)
        this.view.draw();

        this.startTime = timeStamp;
        window.requestAnimationFrame(produceFrame);
    };

    const startAnimation = (timeStamp) => {
        this.startTime = timeStamp;
        this.inputControl.run();
        window.requestAnimationFrame(produceFrame);
    };

    window.requestAnimationFrame(startAnimation);
};