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

function Model(aspectWidth, aspectHeight) {

    this.sun = new SphereModel(
        SUN_RADIUS,
        SUN_ROTATION_SPEED,
        SUN_ROTATION_AXIS,
        null,
        SUN_POSITION_FROM_ORIGIN,
        SUN_ORBITAL_SPEED,
        SUN_ORBITAL_AXIS
    );

    this.earth = new SphereModel(
        EARTH_RADIUS,
        EARTH_ROTATION_SPEED,
        EARTH_ROTATION_AXIS,
        this.sun,
        EARTH_POSITION_FROM_SUN,
        EARTH_ORBITAL_SPEED,
        EARTH_ORBITAL_AXIS
    );

    this.earthMoon = new SphereModel(
        EARTHMOON_RADIUS,
        EARTHMOON_ROTATION_SPEED,
        EARTHMOON_ROTATION_AXIS,
        this.earth,
        EARTHMOON_POSITION_FROM_EARTH,
        EARTHMOON_ORBITAL_SPEED,
        EARTHMOON_ORBITAL_AXIS
    );

    this.camera = new CameraModel(aspectWidth, aspectHeight, this.sun.position);
}

Model.prototype.update = function (runtime, keysPressed) {
    this.sun.rotateAroundOwnAxis(runtime);
    this.earth.orbit(runtime);
    this.earth.rotateAroundOwnAxis(runtime);
    this.earthMoon.orbit(runtime);
    this.camera.updateView(runtime, keysPressed, this.sun.position);
};