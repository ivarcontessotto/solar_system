"use strict";

function Model(aspectWidth, aspectHeight) {

    this.sun = createSun();
    this.mercury = createMercury(this.sun);
    this.venus = createVenus(this.sun);
    this.earth = createEarth(this.sun);
    this.earthMoon = createEarthMoon(this.earth);
    this.mars = createMars(this.sun);
    this.jupiter = createJupiter(this.sun);
    this.jupiterMoon01 = createJupiterMoon01(this.jupiter);
    this.jupiterMoon02 = createJupiterMoon02(this.jupiter);
    this.jupiterMoon03 = createJupiterMoon03(this.jupiter);
    this.jupiterMoon04 = createJupiterMoon04(this.jupiter);

    this.camera = new CameraModel(aspectWidth, aspectHeight, this.sun.position);
    this.runtimeMultiplyer = 0.5;
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
        this.jupiterMoon01.orbit(runtime);
        this.jupiterMoon01.rotateAroundOwnAxis(runtime);
        this.jupiterMoon02.orbit(runtime);
        this.jupiterMoon02.rotateAroundOwnAxis(runtime);
        this.jupiterMoon03.orbit(runtime);
        this.jupiterMoon03.rotateAroundOwnAxis(runtime);
        this.jupiterMoon04.orbit(runtime);
        this.jupiterMoon04.rotateAroundOwnAxis(runtime);
    }
    this.camera.updateView(baseRuntime, keysPressed, this.sun.position);
};