"use strict";


function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.startTime = null;
}

Controller.prototype.run = function() {

    const seconds = (runtime) => runtime / 1000;

    const startAnimation = (timeStamp) => {
        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    const animateFrame = (timeStamp) => {
        const runtime = seconds(timeStamp - this.startTime);
        // todo maybe have one function on the model itself which then calls each planet...
        // Update the model transformations
        this.model.sun.orbit(runtime);
        this.model.sun.rotateAroundOwnAxis(runtime);
        this.model.earth.orbit(runtime);
        this.model.earth.rotateAroundOwnAxis(runtime);

        // Draw the scene
        this.view.draw();

        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    window.requestAnimationFrame(startAnimation);
};