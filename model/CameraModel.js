"use strict";

// Projection
const VERTICAL_FIELD_OF_VIEW = Math.PI/4;
const Z_NEAR = 1;
const Z_FAR = 210000;

// View
const INITIAL_POSITION = [0, 0, 5000]; // In world coordinates
const LOOK_AT = [0, 0, 0]; // In world coordinates
const UP = [0, 1, 0]; // In world coordinates

// Camera movement
const TRANSLATION_SPEED = 500;
const ROTATION_SPEED = Math.PI / 4;

function CameraModel(aspectWidth, aspectHeight, sunPosition) {

    const createSunPositionEye = () => {
        this.sunPositionEye = vec3HomogeneousToCartesian(
            vec4MultiplyMat4(
                vec4CartesianToHomogeneous(sunPosition), this.viewMatrix));
    };

    this.projectionMatrix = mat4CreateProjection(VERTICAL_FIELD_OF_VIEW, aspectWidth / aspectHeight, Z_NEAR, Z_FAR);
    this.viewMatrix = mat4CreateLookAt(INITIAL_POSITION, LOOK_AT, UP);
    createSunPositionEye();
}

CameraModel.prototype.updateView = function (runtime, keysPressed, sunPosition) {

    const updateSunPositionEye = () => {
        this.sunPositionEye = vec3HomogeneousToCartesian(
            vec4MultiplyMat4(
                vec4CartesianToHomogeneous(sunPosition), this.viewMatrix));
    };

    // // Move camera forward backward
    // const translationFactor = TRANSLATION_SPEED * runtime;
    // const translationVector = [0, 0, translationFactor * (keysPressed[MOVE_FORWARD] - keysPressed[MOVE_BACKWARD])];
    // this.viewMatrix = mat4TranslatePreMul(this.viewMatrix, translationVector);
    //
    // const rotationFactor = ROTATION_SPEED * runtime;
    // // Rotate camera left right
    // let rotationAngle = rotationFactor * (keysPressed[ROTATE_LEFT] - keysPressed[ROTATE_RIGHT]);
    // this.viewMatrix = mat4RotatePreMul(this.viewMatrix, -rotationAngle, [0, 1, 0]);
    // // Roll camera forward backward
    // rotationAngle = rotationFactor * (keysPressed[ROLL_FORWARD] - keysPressed[ROLL_BACKWARD]);
    // this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngle, [1, 0, 0]);
    // // Roll camera left right
    // rotationAngle = rotationFactor * (keysPressed[ROLL_LEFT] - keysPressed[ROLL_RIGHT]);
    // this.viewMatrix = mat4RotatePreMul(this.viewMatrix, -rotationAngle, [0, 0, 1]);

    updateSunPositionEye();
};

