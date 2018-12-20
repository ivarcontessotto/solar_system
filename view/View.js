"use strict";

// todo move this
const SHADOWMAP_RESOLUTION = 4096;
const LIGHT_VERTICAL_FIELD_OF_VIEW = Math.PI/2;
const LIGHT_Z_NEAR = 500;
const LIGHT_Z_FAR = 50000;
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
// Map indexes
const blackMapIndex = 0;
const sunMapIndex = 1;
const earthDayMapIndex = 2;
const earthSpecularMapIndex = 3;
const earthNightMapIndex = 4;
const earthCloudMapIndex = 5;
const earthMoonMapIndex = 6;
const mercuryMapIndex = 7;
const venusAtmosphereMapIndex = 8;
const marsMapIndex = 9;
const jupiterMapIndex = 10;

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
const earthAmbientStrength = 0.75;
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

function View(canvas, model, callback) {

    // todo this may stay here. maybe same for all rendering types. but not sure. lets see how shadow mapping works
    const setUpHiddenSurfaceRemoval = () => {
        // back-face culling
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.CULL_FACE);
        // depth buffer
        this.gl.enable(this.gl.DEPTH_TEST);
    };

    const createTexture = (item, index) => {
        item.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, item.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, item.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

    // todo stays here, but use different material classes that fit the specific use
    const initBodySurfaceAttributes = () => {

        this.sunSurface = new SurfaceAttribute(
            this.textureItems[sunMapIndex].texture,
            this.textureItems[blackMapIndex].texture,
            this.textureItems[blackMapIndex].texture,
            [0, 0, 0, 0],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.mercurySurface = new SurfaceAttribute(
            this.textureItems[mercuryMapIndex].texture,
            this.textureItems[mercuryMapIndex].texture,
            this.textureItems[mercuryMapIndex].texture,
            [mercuryDiffuseStrength, mercurySpecularStrength, mercuryShininess, mercuryAmbientStrength],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.venusSurface = new SurfaceAttribute(
            this.textureItems[venusAtmosphereMapIndex].texture,
            this.textureItems[venusAtmosphereMapIndex].texture,
            this.textureItems[venusAtmosphereMapIndex].texture,
            [venusDiffuseStrength, venusSpecularStrength, venusShininess, venusAmbientStrength],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.earthSurface = new SurfaceAttribute(
            this.textureItems[earthDayMapIndex].texture,
            this.textureItems[earthSpecularMapIndex].texture,
            this.textureItems[earthNightMapIndex].texture,
            [earthDiffuseStrength, earthSpecularStrength, earthShininess, earthAmbientStrength],
            this.textureItems[earthCloudMapIndex].texture,
            [earthCloudDiffuseStrength, earthCloudAmbientStrength]);

        this.earthMoonSurface = new SurfaceAttribute(
            this.textureItems[earthMoonMapIndex].texture,
            this.textureItems[earthMoonMapIndex].texture,
            this.textureItems[earthMoonMapIndex].texture,
            [earthMoonDiffuseStrength, earthMoonSpecularStrength, earthMoonShininess, earthMoonAmbientStrength],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.marsSurface = new SurfaceAttribute(
            this.textureItems[marsMapIndex].texture,
            this.textureItems[marsMapIndex].texture,
            this.textureItems[marsMapIndex].texture,
            [marsDiffuseStrength, marsSpecularStrength, marsShininess, marsAmbientStrength],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.jupiterSurface = new SurfaceAttribute(
            this.textureItems[jupiterMapIndex].texture,
            this.textureItems[jupiterMapIndex].texture,
            this.textureItems[jupiterMapIndex].texture,
            [jupiterDiffuseStrength, jupiterSpecularStrength, jupiterShininess, jupiterAmbientStrength],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);
    };

    let imagesToLoad = 0;

    const onImageLoad = () => {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            this.textureItems.forEach(createTexture);
            initBodySurfaceAttributes();
            callback();
        }
    };

    const loadImage = (item, index) => {
        item.image = new Image();
        item.image.onload = onImageLoad;
        item.image.src = item.url;
    };

    const loadTextureImages = () => {
        this.textureItems = [];
        this.textureItems[blackMapIndex] = {url: "images/2k_black.jpg"};
        this.textureItems[sunMapIndex] = {url: "images/2k_sun.jpg"};
        this.textureItems[earthDayMapIndex] = {url: "images/2k_earth_daymap.jpg"};
        this.textureItems[earthSpecularMapIndex] = {url: "images/2k_earth_specular_map.jpg"};
        this.textureItems[earthNightMapIndex] = {url: "images/2k_earth_nightmap.jpg"};
        this.textureItems[earthCloudMapIndex] = {url: "images/2k_earth_clouds.jpg"};
        this.textureItems[earthMoonMapIndex] = {url: "images/2k_moon.jpg"};
        this.textureItems[mercuryMapIndex] = {url: "images/2k_mercury.jpg"};
        this.textureItems[venusAtmosphereMapIndex] = {url: "images/2k_venus_atmosphere.jpg"};
        this.textureItems[marsMapIndex] = {url: "images/2k_mars.jpg"};
        this.textureItems[jupiterMapIndex] = {url: "images/2k_jupiter.jpg"};
        imagesToLoad = this.textureItems.length;
        this.textureItems.forEach(loadImage);
    };

    this.model = model;
    this.gl = createGLContext(canvas);
    console.log("MAX TEXTURE IMAGE UNITS: ", this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS));
    const sphereBuffers = new SphereBuffers(this.gl, 50, 50);
    this.renderingShadowmapPositiveX = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_POS_X);
    this.renderingShadowmapNegativeX = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_NEG_X);
    this.renderingShadowmapPositiveZ = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_POS_Z);
    this.renderingShadowmapNegativeZ = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX_NEG_Z);
    this.renderingUnlit = new RenderingUnlit(this.gl, sphereBuffers, this.model.camera.projectionMatrix);
    this.rendering = new Rendering(this.gl, sphereBuffers, this.model.camera.projectionMatrix, LIGHT_PROJECTION_VIEW_MATRICES);
    setUpHiddenSurfaceRemoval(); // todo stays here probably. but lets see what shadow mapping needs
    // This needs to be done last because images are loaded asynchronously in browser!
    loadTextureImages();
}

View.prototype.draw = function() {
    // Render shadowmap
    const shadowmaps = [];

    this.renderingShadowmapPositiveX.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapPositiveX.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapPositiveX.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapPositiveX.draw(this.model.mars.modelMatrix, false);
    shadowmaps[0] = this.renderingShadowmapPositiveX.draw(this.model.jupiter.modelMatrix, false);

    this.renderingShadowmapNegativeX.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapNegativeX.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapNegativeX.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapNegativeX.draw(this.model.mars.modelMatrix, false);
    shadowmaps[1] = this.renderingShadowmapNegativeX.draw(this.model.jupiter.modelMatrix, false);

    this.renderingShadowmapPositiveZ.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapPositiveZ.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapPositiveZ.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapPositiveZ.draw(this.model.mars.modelMatrix, false);
    shadowmaps[2] = this.renderingShadowmapPositiveZ.draw(this.model.jupiter.modelMatrix, false);

    this.renderingShadowmapNegativeZ.draw(this.model.mercury.modelMatrix, true);
    this.renderingShadowmapNegativeZ.draw(this.model.venus.modelMatrix, true);
    this.renderingShadowmapNegativeZ.draw(this.model.earth.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.earthMoon.modelMatrix, false);
    this.renderingShadowmapNegativeZ.draw(this.model.mars.modelMatrix, false);
    shadowmaps[3] = this.renderingShadowmapNegativeZ.draw(this.model.jupiter.modelMatrix, false);

    this.renderingUnlit.draw(this.sunSurface, this.model.sun.modelMatrix, this.model.camera.viewMatrix, true);
    this.rendering.draw(this.mercurySurface, this.model.mercury.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.venusSurface, this.model.venus.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.earthSurface, this.model.earth.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.earthMoonSurface, this.model.earthMoon.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.marsSurface, this.model.mars.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
    this.rendering.draw(this.jupiterSurface, this.model.jupiter.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmaps, false);
};