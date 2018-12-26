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

    const inputHandler = (input, isDown) => {
        if (input === "w" || input === "W") {
            this.moveForward = isDown;
        }
        else if (input === "s" || input === "S") {
            this.moveBackward = isDown;
        }
        else if (input === "a" || input === "A") {
            this.rotateLeft = isDown;
        }
        else if (input === "d" || input === "D") {
            this.rotateRight = isDown;
        }
        else if (input === "ArrowUp") {
            this.rollForward = isDown;
        }
        else if (input === "ArrowDown") {
            this.rollBackward = isDown;
        }
        else if (input === "ArrowLeft") {
            this.rollLeft = isDown;
        }
        else if (input === "ArrowRight") {
            this.rollRight = isDown;
        }
        else if (input === "p" || input === "P") {
            if (!isDown) {
                this.animationPauseFactor = (this.animationPauseFactor + 1) % 2;
            }
        }
        else if (input === "+") {
            if (!isDown) {
                this.animationSpeedFactor *= 2.0;
            }
        }
        else if (input === "-") {
            if (!isDown) {
                this.animationSpeedFactor /= 2.0;
            }
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

InputControl.prototype.getAnimationSpeedFactor = function() {
    return this.animationPauseFactor * this.animationSpeedFactor;
};

InputControl.prototype.getTranslationFactors = function() {
    return [0, 0, this.moveForward - this.moveBackward];
};

InputControl.prototype.getRotationFactors = function() {
    return [
        (this.rollBackward - this.rollForward),
        (this.rotateLeft - this.rotateRight),
        (this.rollLeft - this.rollRight)
    ];
};