"use strict";

// Sun
const SUN_RADIUS = 500;
const SUN_ROTATION_SPEED = Math.PI / 64;
const SUN_ROTATION_AXIS = [0, 1, 0];
const SUN_POSITION_FROM_ORIGIN = [0, 0, 0];
const SUN_ORBITAL_SPEED = 0;
const SUN_ORBITAL_AXIS = [0, 1, 0];

// Earth
const EARTH_RADIUS = 80;
const EARTH_ROTATION_SPEED = Math.PI / 8;
const EARTH_ROTATION_AXIS = [0, 1, 0];
const EARTH_POSITION_FROM_SUN = [1500, 0, 0];
const EARTH_ORBITAL_SPEED = Math.PI / 32;
const EARTH_ORBITAL_AXIS = [0, 1, 0];

// Earth Moon
const EARTHMOON_RADIUS = 30;
const EARTHMOON_ROTATION_SPEED = 0;
const EARTHMOON_ROTATION_AXIS = [0, 1, 0];
const EARTHMOON_POSITION_FROM_EARTH = [300, 0, 0];
const EARTHMOON_ORBITAL_SPEED = Math.PI / 8;
const EARTHMOON_ORBITAL_AXIS = [0, 1, 0];

function Model(canvas) {

    // Projection // todo put this into camera model object
    const verticalFieldOfView = Math.PI/4;
    const zNear = 1;
    const zFar = 100000;

    // View // todo put this into camera model object
    this.eye = [0, 0, 2500];
    this.at = [0, 0, 0];
    this.up = [0, 1, 0];
    this.cameraTranslationSpeed = 1000;
    this.cameraRotationSpeed = Math.PI / 2;

    this.sun = new BodyModel(
        SUN_RADIUS,
        SUN_ROTATION_SPEED,
        SUN_ROTATION_AXIS,
        null,
        SUN_POSITION_FROM_ORIGIN,
        SUN_ORBITAL_SPEED,
        SUN_ORBITAL_AXIS
    );

    this.earth = new BodyModel(
        EARTH_RADIUS,
        EARTH_ROTATION_SPEED,
        EARTH_ROTATION_AXIS,
        this.sun,
        EARTH_POSITION_FROM_SUN,
        EARTH_ORBITAL_SPEED,
        EARTH_ORBITAL_AXIS
    );

    this.earthMoon = new BodyModel(
        EARTHMOON_RADIUS,
        EARTHMOON_ROTATION_SPEED,
        EARTHMOON_ROTATION_AXIS,
        this.earth,
        EARTHMOON_POSITION_FROM_EARTH,
        EARTHMOON_ORBITAL_SPEED,
        EARTHMOON_ORBITAL_AXIS
    );

    const createSunPositionEye = () => {
        this.sunPositionEye = vec3HomogeneousToCartesian(
            vec4MultiplyMat4(
                vec4CartessianToHomogeneous(this.sun.position), this.viewMatrix));
    };

    this.projectionMatrix = mat4CreateProjection(verticalFieldOfView, canvas.width / canvas.height, zNear, zFar);
    this.viewMatrix = mat4CreateLookAt(this.eye, this.at, this.up);
    createSunPositionEye();
}

Model.prototype.update = function (runtime, keysPressed) {

    const updateViewMatrix = () => {
        // Move camera forward backward
        const translationFactor = this.cameraTranslationSpeed * runtime;
        const translationVector = [0, 0, translationFactor * (keysPressed[MOVE_FORWARD] - keysPressed[MOVE_BACKWARD])];
        this.viewMatrix = mat4TranslatePreMul(this.viewMatrix, translationVector);

        const rotationFactor = this.cameraRotationSpeed * runtime;
        // Rotate camera left right
        let rotationAngle = rotationFactor * (keysPressed[ROTATE_LEFT] - keysPressed[ROTATE_RIGHT]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, -rotationAngle, [0, 1, 0]);
        // Roll camera forward backward
        rotationAngle = rotationFactor * (keysPressed[ROLL_FORWARD] - keysPressed[ROLL_BACKWARD]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngle, [1, 0, 0]);
        // Roll camera left right
        rotationAngle = rotationFactor * (keysPressed[ROLL_LEFT] - keysPressed[ROLL_RIGHT]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, -rotationAngle, [0, 0, 1]);
    };

    const updateSunPositionEye = () => {
        this.sunPositionEye = vec3HomogeneousToCartesian(
            vec4MultiplyMat4(
                vec4CartessianToHomogeneous(this.sun.position), this.viewMatrix));
    };

    this.sun.rotateAroundOwnAxis(runtime);
    this.earth.orbit(runtime);
    this.earth.rotateAroundOwnAxis(runtime);
    this.earthMoon.orbit(runtime);
    updateViewMatrix();
    updateSunPositionEye();
};