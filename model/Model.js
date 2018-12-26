"use strict";

function Model(aspectWidth, aspectHeight) {

     // todo remove all those members and process them as a list(in view also)
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
    this.space = createSpace();

    this.sphereModels = [
        this.sun, this.mercury, this.venus, this.earth, this.earthMoon, this.mars, this.jupiter,
        this.jupiterMoon01, this.jupiterMoon02, this.jupiterMoon03, this.jupiterMoon04, this.space
    ];
    this.camera = new CameraModel(aspectWidth, aspectHeight, this.sun.position);
}

Model.prototype.updateAnimatedModels = function(runtimeSeconds) {
    this.sphereModels.forEach((sphereModel) => {
        sphereModel.rotateAroundOwnAxis(runtimeSeconds);
        sphereModel.orbit(runtimeSeconds);
    });
};

Model.prototype.updateCameraView = function(runtimeSeconds, translationFactors, rotationFactors) {
    this.camera.updateView(runtimeSeconds, translationFactors, rotationFactors, this.sun.position);
};