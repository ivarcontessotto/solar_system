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
const TRANSLATION_SPEED = 1000;
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

CameraModel.prototype.updateView = function (runtimeSeconds, translationFactors, rotationFactors, sunPosition) {

    const updateSunPositionEye = () => {
        this.sunPositionEye = vec3HomogeneousToCartesian(
            vec4MultiplyMat4(
                vec4CartesianToHomogeneous(sunPosition), this.viewMatrix));
    };

    this.viewMatrix = mat4TranslatePreMul(this.viewMatrix, vec3MultiplyScalar(translationFactors, TRANSLATION_SPEED * runtimeSeconds));
    const rotationAngles = vec3MultiplyScalar(rotationFactors, (-1) * ROTATION_SPEED * runtimeSeconds);
    this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngles[0], [1, 0, 0]);
    this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngles[1], [0, 1, 0]);
    this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngles[2], [0, 0, 1]);
    updateSunPositionEye();
};