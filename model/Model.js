"use strict";

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

    // Sun
    const sunRadius = 500;
    const sunRotationSpeed = Math.PI / 64;
    const sunRotationAxis = [0, 1, 0];
    const sunPositionFromOrigin = 0;

    // Earth
    const earthRadius = 80;
    const earthRotationSpeed = Math.PI / 8;
    const earthRotationAxis = [0, 1, 0];
    const earthRelPositionFromParent = [1500, 0, 0];
    const earthOrbitalSpeed = Math.PI / 16;
    const earthOrbitalAxis = [0, 1, 0];

    // Earth Moon
    const earthMoonRadius = 30;
    const earthMoonRotationSpeed = 0;
    const earthMoonRotationAxis = [0, 1, 0];
    const earthMoonRelPositionFromParent = [300, 0, 0];
    const earthMoonOrbitalSpeed = Math.PI / 4;
    const earthMoonOrbitalAxis = [0, 1, 0];

    this.sun = new BodyModel(
        sunRadius,
        sunRotationSpeed,
        sunRotationAxis,
        null,
        sunPositionFromOrigin,
        0,
        [0, 1, 0]
    );

    this.earth = new BodyModel(
        earthRadius,
        earthRotationSpeed,
        earthRotationAxis,
        this.sun,
        earthRelPositionFromParent,
        earthOrbitalSpeed,
        earthOrbitalAxis
    );

    this.earthMoon = new BodyModel(
        earthMoonRadius,
        earthMoonRotationSpeed,
        earthMoonRotationAxis,
        this.earth,
        earthMoonRelPositionFromParent,
        earthMoonOrbitalSpeed,
        earthMoonOrbitalAxis
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

    updateViewMatrix();
    updateSunPositionEye();
    this.sun.rotateAroundOwnAxis(runtime);
    this.earth.orbit(runtime);
    this.earth.rotateAroundOwnAxis(runtime);
    this.earthMoon.orbit(runtime);
};