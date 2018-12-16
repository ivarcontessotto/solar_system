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
    const sunOrbitalSpeed = 0;
    const sunOrbitalAxis = null;

    // Earth
    const earthRadius = 80;
    const earthRotationSpeed = Math.PI / 8;
    const earthRotationAxis = [0, 1, 0];
    const earthRelPositionFromParent = [1500, 0, 0];
    const earthOrbitalSpeed = Math.PI / 16;
    const earthOrbitalAxis = [0, 1, 0];

    this.sun = new BodyModel(sunRadius,sunRotationSpeed, sunRotationAxis, null, sunPositionFromOrigin, sunOrbitalSpeed, sunOrbitalAxis);
    this.earth = new BodyModel(earthRadius, earthRotationSpeed, earthRotationAxis, this.sun, earthRelPositionFromParent, earthOrbitalSpeed, earthOrbitalAxis);

    this.projectionMatrix = mat4CreateProjection(verticalFieldOfView, canvas.width / canvas.height, zNear, zFar);
    this.viewMatrix = mat4CreateLookAt(this.eye, this.at, this.up);
}

Model.prototype.update = function (runtime, cameraMovement) {

    const updateViewMatrix = () => {
        // Boost forward / backward
        const translationVector = [0, 0, runtime * this.cameraTranslationSpeed * (cameraMovement[0] - cameraMovement[1])];
        this.viewMatrix = mat4TranslatePreMul(this.viewMatrix, translationVector);
        // Roll left / right
        let rotationAngle = runtime * this.cameraRotationSpeed * (cameraMovement[3] - cameraMovement[2]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngle, [0, 0, 1]);
        // Rotate up / down
        rotationAngle = runtime * this.cameraRotationSpeed * (cameraMovement[5] - cameraMovement[4]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngle, [1, 0, 0]);
        // Rotate left / right
        rotationAngle = runtime * this.cameraRotationSpeed * (cameraMovement[7] - cameraMovement[6]);
        this.viewMatrix = mat4RotatePreMul(this.viewMatrix, rotationAngle, [0, 1, 0]);
    };

    const createSunPositionEye = () => {
        const sunPositionEye = vec4MultiplyMat4(vec4.fromValues(this.sun.position[0], this.sun.position[1], this.sun.position[2], 1), this.viewMatrix);
        return vec3CartesianFromHomogeneous(sunPositionEye);
    };

    updateViewMatrix();
    this.sunPositionEye = createSunPositionEye();
    this.sun.orbit(runtime);
    this.sun.rotateAroundOwnAxis(runtime);
    this.earth.orbit(runtime);
    this.earth.rotateAroundOwnAxis(runtime);
};