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

    const getSeconds = (runtime) => runtime / 1000;

    const animateFrame = (timeStamp) => {
        const runtime = timeStamp - this.startTime;
        // todo Change model
        // todo Draw
        this.startTime = timeStamp;
        window.requestAnimationFrame(animateFrame);
    };

    window.requestAnimationFrame(startAnimation);
};