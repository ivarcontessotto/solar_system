"use strict";

function Model(canvas) {
    // Projection // todo put this into camera model object
    const verticalFieldOfView = Math.PI/4;
    const zNear = 1;
    const zFar = 10000;

    // View // todo put this into camera model object
    const eye = [0, 300, 1000];
    const at = [0, 0, 0];
    const up = [0, 1, 0];

    // Sun
    const sunRadius = 100;
    const sunRotationSpeed = Math.PI / 64;
    const sunRotationAxis = [0, 1, 0];
    const sunPositionFromOrigin = 0;
    const sunOrbitalSpeed = 0;
    const sunOrbitalAxis = null;

    // Earth
    const earthRadius = 80;
    const earthRotationSpeed = Math.PI / 8;
    const earthRotationAxis = [0, 1, 0];
    const earthRelPositionFromParent = [500, 0, 0];
    const earthOrbitalSpeed = Math.PI / 16;
    const earthOrbitalAxis = [0, 1, 0];

    const createSunPositionEye = () => {
        const vec = vec4MultiplyMat4(vec4.fromValues(this.sun.position[0], this.sun.position[1], this.sun.position[2], 1), this.viewMatrix);
        return vec3CartesianFromHomogeneous(vec);
    };

    this.sun = new BodyModel(sunRadius,sunRotationSpeed, sunRotationAxis, null, sunPositionFromOrigin, sunOrbitalSpeed, sunOrbitalAxis);
    this.earth = new BodyModel(earthRadius, earthRotationSpeed, earthRotationAxis, this.sun, earthRelPositionFromParent, earthOrbitalSpeed, earthOrbitalAxis);

    this.projectionMatrix = mat4CreateProjection(verticalFieldOfView, canvas.width / canvas.height, zNear, zFar);
    this.viewMatrix = mat4CreateLookAt(eye, at, up);
    this.sunPositionEye = createSunPositionEye(); // Todo If the sun would move, then this needs to be updated for every frame as well.
}