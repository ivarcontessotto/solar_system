"use strict";

function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.startTime = null;
    this.inputControl = new InputControl();
}

Controller.prototype.run = function() {

    const seconds = (milliseconds) => milliseconds / 1000;

    const produceFrame = (timeStamp) => {
        const runtimeSeconds = seconds(timeStamp - this.startTime);
        this.model.updateAnimatedModels(runtimeSeconds * this.inputControl.getAnimationSpeedFactor());
        this.model.updateCameraView(runtimeSeconds, this.inputControl.getTranslationFactors(), this.inputControl.getRotationFactors());

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