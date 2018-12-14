"use strict";


function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.startTime = null;
}

Controller.prototype.run = function() {

    const startAnimation = (timeStamp) => {
        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    const seconds = (runtime) => runtime / 1000;

    const animateFrame = (timeStamp) => {
        const runtime = timeStamp - this.startTime;
        // todo maybe have one function on the model itself which then calls each planet...
        // Update the model transformations
        this.model.sun.rotateAroundOwnAxis(seconds(runtime));
        this.model.earth.orbit(seconds(runtime));
        this.model.earth.rotateAroundOwnAxis(seconds(runtime));
        // todo draw model
        // Draw the scene
        this.view.draw();

        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    window.requestAnimationFrame(startAnimation);
};