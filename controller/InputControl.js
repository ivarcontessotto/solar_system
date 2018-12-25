"use strict";

function InputControl() {
    this.moveForward = 0;
    this.moveBackward = 0;
    this.rotateLeft = 0;
    this.rotateRight = 0;
    this.rollForward = 0;
    this.rollBackward = 0;
    this.rollLeft = 0;
    this.rollRight = 0;
    this.animationPauseFactor = 1;
    this.animationSpeedFactor = 1.0;
}

InputControl.prototype.run = function () {

    const inputHandler = (input, isActive) => {
        if (input === "w" || input === "W") {
            this.moveForward = isActive;
        }
        else if (input === "s" || input === "S") {
            this.moveBackward = isActive;
        }
        else if (input === "a" || input === "A") {
            this.rotateLeft = isActive;
        }
        else if (input === "d" || input === "D") {
            this.rotateRight = isActive;
        }
        else if (input === "ArrowUp") {
            this.rollForward = isActive;
        }
        else if (input === "ArrowDown") {
            this.rollBackward = isActive;
        }
        else if (input === "ArrowLeft") {
            this.rollLeft = isActive;
        }
        else if (input === "ArrowRight") {
            this.rollRight = isActive;
        }
        else if (input === "p" || input === "P") {
            this.animationPauseFactor = (this.animationPauseFactor + isActive) % 2;
        }
        else if (input === "+") {
            this.animationSpeedFactor *= isActive * 2.0;
        }
        else if (input === "-") {
            this.animationSpeedFactor /= isActive * 2.0;
        }
    };

    const onKeyDown = (event) => {
        inputHandler(event.key, 1);
    };

    const onKeyUp = (event) => {
        inputHandler(event.key, 0);
    };

    window.addEventListener('keyup', onKeyUp, false);
    window.addEventListener('keydown', onKeyDown, false);
};

InputControl.prototype.getAnimationSpeedFactor = function(runtimeFactor) {
    return this.animationPauseFactor * this.animationSpeedFactor * runtimeFactor;
};

InputControl.prototype.getTranslationFactors = function(runtimeFactor) {
    return [0, 0, (this.moveForward - this.moveBackward) * runtimeFactor];
};

InputControl.prototype.getRotationFactors = function(runtimeFactor) {
    return [
        (this.rollBackward - this.rollForward) * runtimeFactor,
        (this.rotateLeft - this.rotateRight) * runtimeFactor,
        (this.rollLeft - this.rollRight) * runtimeFactor
    ];
};