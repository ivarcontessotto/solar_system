"use strict";

// todo move this
const SHADOWMAP_RESOLUTION = 4096;
const LIGHT_VERTICAL_FIELD_OF_VIEW = Math.PI/2;
const LIGHT_Z_NEAR = 500;
const LIGHT_Z_FAR = 100000;
const PROJECTION_MATRIX_LIGHT = mat4CreateProjection(LIGHT_VERTICAL_FIELD_OF_VIEW, SHADOWMAP_RESOLUTION / SHADOWMAP_RESOLUTION, LIGHT_Z_NEAR, LIGHT_Z_FAR);

// View
const LIGHT_POSITION = [0, 0, 0]; // In world coordinates
const LIGHT_UP = [0, 1, 0]; // In world coordinates
const VIEW_MATRIX_LIGHT_POS_X = mat4CreateLookAt(LIGHT_POSITION, [1, 0, 0], LIGHT_UP);
const VIEW_MATRIX_LIGHT_NEG_X = mat4CreateLookAt(LIGHT_POSITION, [-1, 0, 0], LIGHT_UP);
const VIEW_MATRIX_LIGHT_POS_Z = mat4CreateLookAt(LIGHT_POSITION, [0, 0, 1], LIGHT_UP);
const VIEW_MATRIX_LIGHT_NEG_Z = mat4CreateLookAt(LIGHT_POSITION, [0, 0, -1], LIGHT_UP);

const LIGHT_PROJECTION_VIEW_MATRIX_POS_X = mat4Multiply(PROJECTION_MATRIX_LIGHT, VIEW_MATRIX_LIGHT_POS_X);
const LIGHT_PROJECTION_VIEW_MATRIX_NEG_X = mat4Multiply(PROJECTION_MATRIX_LIGHT, VIEW_MATRIX_LIGHT_NEG_X);
const LIGHT_PROJECTION_VIEW_MATRIX_POS_Z = mat4Multiply(PROJECTION_MATRIX_LIGHT, VIEW_MATRIX_LIGHT_POS_Z);
const LIGHT_PROJECTION_VIEW_MATRIX_NEG_Z = mat4Multiply(PROJECTION_MATRIX_LIGHT, VIEW_MATRIX_LIGHT_NEG_Z);
const LIGHT_PROJECTION_VIEW_MATRICES = [
    LIGHT_PROJECTION_VIEW_MATRIX_POS_X,
    LIGHT_PROJECTION_VIEW_MATRIX_NEG_X,
    LIGHT_PROJECTION_VIEW_MATRIX_POS_Z,
    LIGHT_PROJECTION_VIEW_MATRIX_NEG_Z
];

// todo Materials
// Mercury surface constants
const mercuryDiffuseStrength = 1;
const mercurySpecularStrength = 0.8;
const mercuryShininess = 2;
const mercuryAmbientStrength = 0.1;

// Venus surface constants
const venusDiffuseStrength = 1;
const venusSpecularStrength = 0.75;
const venusShininess = 10;
const venusAmbientStrength = 0.1;

// Earth surface constants
const earthDiffuseStrength = 1;
const earthSpecularStrength = 0.5;
const earthShininess = 10;
const earthAmbientStrength = 0.5;
const earthCloudDiffuseStrength = 1;
const earthCloudAmbientStrength = 0.1;

// Earth Moon surface constants
const earthMoonDiffuseStrength = 1;
const earthMoonSpecularStrength = 0.75;
const earthMoonShininess = 1;
const earthMoonAmbientStrength = 0.1;

// Mars surface constants
const marsDiffuseStrength = 1;
const marsSpecularStrength = 0.75;
const marsShininess = 10;
const marsAmbientStrength = 0.1;

// Jupiter surface constants
const jupiterDiffuseStrength = 1;
const jupiterSpecularStrength = 0.5;
const jupiterShininess = 10;
const jupiterAmbientStrength = 0.1;

// Jupiter Moon 01 surface constants
const jupiterMoon01DiffuseStrength = 1;
const jupiterMoon01SpecularStrength = 0.75;
const jupiterMoon01Shininess = 1;
const jupiterMoon01AmbientStrength = 0.1;

// Jupiter Moon 02 surface constants
const jupiterMoon02DiffuseStrength = 1;
const jupiterMoon02SpecularStrength = 0.75;
const jupiterMoon02Shininess = 1;
const jupiterMoon02AmbientStrength = 0.1;

// Jupiter Moon 03 surface constants
const jupiterMoon03DiffuseStrength = 1;
const jupiterMoon03SpecularStrength = 0.75;
const jupiterMoon03Shininess = 1;
const jupiterMoon03AmbientStrength = 0.1;

// Jupiter Moon 04 surface constants
const jupiterMoon04DiffuseStrength = 1;
const jupiterMoon04SpecularStrength = 0.75;
const jupiterMoon04Shininess = 1;
const jupiterMoon04AmbientStrength = 0.1;

function View(canvas, model, textureImages) {

    const createTexture = (image, index) => {
        const textureMap = this.gl.createTexture();
        this.textureMaps[index] = textureMap;
        this.gl.bindTexture(this.gl.TEXTURE_2D, textureMap);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE,image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

    const setUpHiddenSurfaceRemoval = () => {
        // back-face culling
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.CULL_FACE);
        // depth buffer
        this.gl.enable(this.gl.DEPTH_TEST);
    };

    // todo use different material classes that fit the specific use
    const initBodySurfaceAttributes = () => {

        this.sunSurface = new SurfaceAttribute(
            this.textureMaps[SUN_MAP],
            this.textureMaps[BLACK_MAP],
            this.textureMaps[BLACK_MAP],
            [0, 0, 0, 0],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.mercurySurface = new SurfaceAttribute(
            this.textureMaps[MERCURY_MAP],
            this.textureMaps[MERCURY_MAP],
            this.textureMaps[MERCURY_MAP],
            [mercuryDiffuseStrength, mercurySpecularStrength, mercuryShininess, mercuryAmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.venusSurface = new SurfaceAttribute(
            this.textureMaps[VENUS_MAP],
            this.textureMaps[VENUS_MAP],
            this.textureMaps[VENUS_MAP],
            [venusDiffuseStrength, venusSpecularStrength, venusShininess, venusAmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.earthSurface = new SurfaceAttribute(
            this.textureMaps[EARTH_DAY_MAP],
            this.textureMaps[EARTH_SPECULAR_MAP],
            this.textureMaps[EARTH_NIGHT_MAP],
            [earthDiffuseStrength, earthSpecularStrength, earthShininess, earthAmbientStrength],
            this.textureMaps[EARTH_CLOUD_MAP],
            [earthCloudDiffuseStrength, earthCloudAmbientStrength]);

        this.earthMoonSurface = new SurfaceAttribute(
            this.textureMaps[EARTH_MOON_MAP],
            this.textureMaps[EARTH_MOON_MAP],
            this.textureMaps[EARTH_MOON_MAP],
            [earthMoonDiffuseStrength, earthMoonSpecularStrength, earthMoonShininess, earthMoonAmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.marsSurface = new SurfaceAttribute(
            this.textureMaps[MARS_MAP],
            this.textureMaps[MARS_MAP],
            this.textureMaps[MARS_MAP],
            [marsDiffuseStrength, marsSpecularStrength, marsShininess, marsAmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.jupiterSurface = new SurfaceAttribute(
            this.textureMaps[JUPITER_MAP],
            this.textureMaps[JUPITER_MAP],
            this.textureMaps[JUPITER_MAP],
            [jupiterDiffuseStrength, jupiterSpecularStrength, jupiterShininess, jupiterAmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.jupiterMoon01Surface = new SurfaceAttribute(
            this.textureMaps[JUPITER_MOON_01_MAP],
            this.textureMaps[JUPITER_MOON_01_MAP],
            this.textureMaps[JUPITER_MOON_01_MAP],
            [jupiterMoon01DiffuseStrength, jupiterMoon01SpecularStrength, jupiterMoon01Shininess, jupiterMoon01AmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.jupiterMoon02Surface= new SurfaceAttribute(
            this.textureMaps[JUPITER_MOON_02_MAP],
            this.textureMaps[JUPITER_MOON_02_MAP],
            this.textureMaps[JUPITER_MOON_02_MAP],
            [jupiterMoon02DiffuseStrength, jupiterMoon02SpecularStrength, jupiterMoon02Shininess, jupiterMoon02AmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.jupiterMoon03Surface = new SurfaceAttribute(
            this.textureMaps[JUPITER_MOON_03_MAP],
            this.textureMaps[JUPITER_MOON_03_MAP],
            this.textureMaps[JUPITER_MOON_03_MAP],
            [jupiterMoon03DiffuseStrength, jupiterMoon03SpecularStrength, jupiterMoon03Shininess, jupiterMoon03AmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);

        this.jupiterMoon04Surface = new SurfaceAttribute(
            this.textureMaps[JUPITER_MOON_04_MAP],
            this.textureMaps[JUPITER_MOON_04_MAP],
            this.textureMaps[JUPITER_MOON_04_MAP],
            [jupiterMoon04DiffuseStrength, jupiterMoon04SpecularStrength, jupiterMoon04Shininess, jupiterMoon04AmbientStrength],
            this.textureMaps[BLACK_MAP],
            [0, 0]);
    };

    this.gl = createGLContext(canvas);
    console.log("MAX TEXTURE IMAGE UNITS: ", this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS));
    this.model = model;
    this.textureMaps = [];
    textureImages.forEach(createTexture);
    const sphereBuffers = new SphereBuffers(this.gl, 50, 50);
    this.renderingShadowmapPositiveX = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_POS_X);
    this.renderingShadowmapNegativeX = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_NEG_X);
    this.renderingShadowmapPositiveZ = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_POS_Z);
    this.renderingShadowmapNegativeZ = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_NEG_Z);
    this.renderingUnlit = new RenderingUnlit(this.gl, sphereBuffers, this.model.camera.projectionMatrix);
    this.rendering = new Rendering(this.gl, sphereBuffers, this.model.camera.projectionMatrix, LIGHT_PROJECTION_VIEW_MATRICES);
    initBodySurfaceAttributes();
    setUpHiddenSurfaceRemoval();
}

View.prototype.draw = function() {
    // Render shadowmap
    const shadowmaps = [];

    this.renderingShadowmapPositiveX.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapPositiveX.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapPositiveX.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.mars.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.jupiter.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.jupiterMoon01.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.jupiterMoon02.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.jupiterMoon03.modelMatrix, false);
    shadowmaps[0] = this.renderingShadowmapPositiveX.draw(this.model.jupiterMoon04.modelMatrix, false);

    this.renderingShadowmapNegativeX.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapNegativeX.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapNegativeX.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.mars.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.jupiter.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.jupiterMoon01.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.jupiterMoon02.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.jupiterMoon03.modelMatrix, false);
    shadowmaps[1] = this.renderingShadowmapNegativeX.draw(this.model.jupiterMoon04.modelMatrix, false);

    this.renderingShadowmapPositiveZ.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapPositiveZ.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapPositiveZ.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.mars.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.jupiter.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.jupiterMoon01.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.jupiterMoon02.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.jupiterMoon03.modelMatrix, false);
    shadowmaps[2] = this.renderingShadowmapPositiveZ.draw(this.model.jupiterMoon04.modelMatrix, false);

    this.renderingShadowmapNegativeZ.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapNegativeZ.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapNegativeZ.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.mars.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.jupiter.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.jupiterMoon01.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.jupiterMoon02.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.jupiterMoon03.modelMatrix, false);
    shadowmaps[3] = this.renderingShadowmapNegativeZ.draw(this.model.jupiterMoon04.modelMatrix, false);

    this.renderingUnlit.draw(this.sunSurface, this.model.sun.modelMatrix, this.model.camera.viewMatrix, true);
    this.rendering.draw(this.mercurySurface, this.model.mercury.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.venusSurface, this.model.venus.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.earthSurface, this.model.earth.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.earthMoonSurface, this.model.earthMoon.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.marsSurface, this.model.mars.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterSurface, this.model.jupiter.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterMoon01Surface, this.model.jupiterMoon01.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterMoon02Surface, this.model.jupiterMoon02.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterMoon03Surface, this.model.jupiterMoon03.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterMoon04Surface, this.model.jupiterMoon04.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
};