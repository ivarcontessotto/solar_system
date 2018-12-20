"use strict";

// Sun
const SUN_RADIUS = 500;
const SUN_ROTATION_SPEED = 2*Math.PI / (60*15);
const SUN_ROTATION_AXIS = [0, 1, 0];
const SUN_POSITION_FROM_ORIGIN = [0, 0, 0];
const SUN_ORBITAL_SPEED = 0;
const SUN_ORBITAL_AXIS = [0, 1, 0];

// Mercury
const MERCURY_RADIUS = 30;
const MERCURY_ROTATION_SPEED = 2*Math.PI / (60/5);
const MERCURY_ROTATION_AXIS = [0, 1, 0];
const MERCURY_POSITION_FROM_SUN = [-1000, 0, 0];
const MERCURY_ORBITAL_SPEED = 2*Math.PI / (60*6);
const MERCURY_ORBITAL_AXIS = [0, 1, -0.2];

// Venus
const VENUS_RADIUS = 70;
const VENUS_ROTATION_SPEED = 2*Math.PI / (60/5);
const VENUS_ROTATION_AXIS = [0, 1, 0];
const VENUS_POSITION_FROM_SUN = [0, 0, -3000];
const VENUS_ORBITAL_SPEED = 2*Math.PI / (60*8);
const VENUS_ORBITAL_AXIS = [0, 1, -0.2];

// Earth
const EARTH_RADIUS = 80;
const EARTH_ROTATION_SPEED = 2*Math.PI / (60/5);
const EARTH_ROTATION_AXIS = [0, 1, 0.1];
const EARTH_POSITION_FROM_SUN = [5000, 0, 0];
const EARTH_ORBITAL_SPEED = 2*Math.PI / (60*10);
const EARTH_ORBITAL_AXIS = [0, 1, 0.2];

// Earth Moon
const EARTHMOON_RADIUS = 20;
const EARTHMOON_ROTATION_SPEED = 0;
const EARTHMOON_ROTATION_AXIS = [0, 1, 0];
const EARTHMOON_POSITION_FROM_EARTH = [300, 0, 0];
const EARTHMOON_ORBITAL_SPEED = 2*Math.PI / 60;
const EARTHMOON_ORBITAL_AXIS = [0, 1, 0.2];

// Mars
const MARS_RADIUS = 40;
const MARS_ROTATION_SPEED = 2*Math.PI / (60/5);
const MARS_ROTATION_AXIS = [0, 1, 0];
const MARS_POSITION_FROM_SUN = [0, 0, 7000];
const MARS_ORBITAL_SPEED = 2*Math.PI / (60*12);
const MARS_ORBITAL_AXIS = [0, 1, 0.25];

// Jupiter
const JUPITER_RADIUS = 200;
const JUPITER_ROTATION_SPEED = 2*Math.PI / (60/5);
const JUPITER_ROTATION_AXIS = [0, 1, 0];
const JUPITER_POSITION_FROM_SUN = [-20000, 0, 0];
const JUPITER_ORBITAL_SPEED = 2*Math.PI / (60*20);
const JUPITER_ORBITAL_AXIS = [0, 1, 0];

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

    this.mercury = new SphereModel(
        MERCURY_RADIUS,
        MERCURY_ROTATION_SPEED,
        MERCURY_ROTATION_AXIS,
        this.sun,
        MERCURY_POSITION_FROM_SUN,
        MERCURY_ORBITAL_SPEED,
        MERCURY_ORBITAL_AXIS
    );

    this.venus = new SphereModel(
        VENUS_RADIUS,
        VENUS_ROTATION_SPEED,
        VENUS_ROTATION_AXIS,
        this.sun,
        VENUS_POSITION_FROM_SUN,
        VENUS_ORBITAL_SPEED,
        VENUS_ORBITAL_AXIS
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

    this.mars = new SphereModel(
        MARS_RADIUS,
        MARS_ROTATION_SPEED,
        MARS_ROTATION_AXIS,
        this.sun,
        MARS_POSITION_FROM_SUN,
        MARS_ORBITAL_SPEED,
        MARS_ORBITAL_AXIS
    );

    this.jupiter = new SphereModel(
        JUPITER_RADIUS,
        JUPITER_ROTATION_SPEED,
        JUPITER_ROTATION_AXIS,
        this.sun,
        JUPITER_POSITION_FROM_SUN,
        JUPITER_ORBITAL_SPEED,
        JUPITER_ORBITAL_AXIS
    );

    this.camera = new CameraModel(aspectWidth, aspectHeight, this.sun.position);
    this.runtimeMultiplyer = 1.0;
}

Model.prototype.update = function (baseRuntime, keysPressed) {
    if (keysPressed[SPEED_UP] === 1) {
        this.runtimeMultiplyer *= 2;
    }
    if (keysPressed[SLOW_DOWN] === 1) {
        this.runtimeMultiplyer /= 2;
    }
    if (keysPressed[PAUSE] === 0) {
        const runtime = baseRuntime * this.runtimeMultiplyer;
        this.sun.rotateAroundOwnAxis(runtime);
        this.mercury.orbit(runtime);
        this.mercury.rotateAroundOwnAxis(runtime);
        this.venus.orbit(runtime);
        this.venus.rotateAroundOwnAxis(runtime);
        this.earth.orbit(runtime);
        this.earth.rotateAroundOwnAxis(runtime);
        this.earthMoon.orbit(runtime);
        this.mars.orbit(runtime);
        this.mars.rotateAroundOwnAxis(runtime);
        this.jupiter.orbit(runtime);
        this.jupiter.rotateAroundOwnAxis(runtime);
    }
    this.camera.updateView(baseRuntime, keysPressed, this.sun.position);
};