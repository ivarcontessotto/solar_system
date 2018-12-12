"use strict";

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

// Earth
const earthRadius = 80;
const earthDistanceFromSun = 500;
const earthRotationSpeed = Math.PI / 8;
const earthOrbitalSpeed = Math.PI / 16;

function Model(canvas) {

    const createLightPositionEye = () => {
        const vec = vec4MultiplyMat4(
            vec4.fromValues(this.sun.position[0], this.sun.position[1], this.sun.position[2], 1),
            this.viewMatrix);
        return vec3CartesianFromHomogeneous(vec);
    };

    this.projectionMatrix = mat4CreateProjection(verticalFieldOfView, canvas.width / canvas.height, zNear, zFar);
    this.viewMatrix = mat4CreateLookAt(eye, at, up);
    this.lightPositionEye = createLightPositionEye();

    this.sun = new SolarSystemBody(sunRadius, sunRotationSpeed, null, 0, 0);
    this.earth = new SolarSystemBody(earthRadius, earthRotationSpeed, this.sun, earthDistanceFromSun, earthOrbitalSpeed);
}