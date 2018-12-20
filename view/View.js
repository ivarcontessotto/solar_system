"use strict";

// todo move this
const SHADOWMAP_RESOLUTION = 2048;
const LIGHT_VERTICAL_FIELD_OF_VIEW = Math.PI/2;
const LIGHT_Z_NEAR = 1;
const LIGHT_Z_FAR = 10000;
const PROJECTION_MATRIX_LIGHT = mat4CreateProjection(LIGHT_VERTICAL_FIELD_OF_VIEW, SHADOWMAP_RESOLUTION / SHADOWMAP_RESOLUTION, LIGHT_Z_NEAR, LIGHT_Z_FAR);

// View
const LIGHT_POSITION = [0, 0, 0]; // In world coordinates
const LIGHT_LOOK_AT = [1, 0, 0]; // In world coordinates
const LIGHT_UP = [0, 1, 0]; // In world coordinates
const VIEW_MATRIX_LIGHT = mat4CreateLookAt(LIGHT_POSITION, LIGHT_LOOK_AT, LIGHT_UP);

const LIGHT_PROJECTION_VIEW_MATRIX = mat4Multiply(PROJECTION_MATRIX_LIGHT, VIEW_MATRIX_LIGHT);

// todo Materials
// Map indexes
const blackMapIndex = 0;
const sunMapIndex = 1;
const earthDayMapIndex = 2;
const earthSpecularMapIndex = 3;
const earthNightMapIndex = 4;
const earthCloudMapIndex = 5;
const earthMoonMapIndex = 6;

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
const earthMoonAmbientStrength = 0.05;

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
        this.sunSurface = new BodySurfaceAttribute(
            this.textureItems[sunMapIndex].texture,
            this.textureItems[blackMapIndex].texture,
            this.textureItems[blackMapIndex].texture,
            [0, 0, 0, 0],
            this.textureItems[blackMapIndex].texture,
            [0, 0]);

        this.earthSurface = new BodySurfaceAttribute(
            this.textureItems[earthDayMapIndex].texture,
            this.textureItems[earthSpecularMapIndex].texture,
            this.textureItems[earthNightMapIndex].texture,
            [earthDiffuseStrength, earthSpecularStrength, earthShininess, earthAmbientStrength],
            this.textureItems[earthCloudMapIndex].texture,
            [earthCloudDiffuseStrength, earthCloudAmbientStrength]);

        this.earthMoonSurface = new BodySurfaceAttribute(
            this.textureItems[earthMoonMapIndex].texture,
            this.textureItems[earthMoonMapIndex].texture,
            this.textureItems[earthMoonMapIndex].texture,
            [earthMoonDiffuseStrength, earthMoonSpecularStrength, earthMoonShininess, earthMoonAmbientStrength],
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
        imagesToLoad = this.textureItems.length;
        this.textureItems.forEach(loadImage);
    };

    this.model = model;
    this.gl = createGLContext(canvas);
    console.log("MAX TEXTURE IMAGE UNITS: ", this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS));
    const sphereBuffers = new SphereBuffers(this.gl, 50, 50);
    this.renderingShadowmap = new RenderingShadowmap(this.gl, sphereBuffers, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION, LIGHT_PROJECTION_VIEW_MATRIX); // todo get those params
    this.renderingUnlit = new RenderingUnlit(this.gl, sphereBuffers, this.model.camera.projectionMatrix);
    this.rendering = new Rendering(this.gl, sphereBuffers, this.model.camera.projectionMatrix, LIGHT_PROJECTION_VIEW_MATRIX);
    setUpHiddenSurfaceRemoval(); // todo stays here probably. but lets see what shadow mapping needs
    // This needs to be done last because images are loaded asynchronously in browser!
    loadTextureImages();
}

View.prototype.draw = function() {
    this.renderingShadowmap.draw(this.model.earth.modelMatrix, true);
    const shadowmap = this.renderingShadowmap.draw(this.model.earthMoon.modelMatrix, false);

    this.renderingUnlit.draw(this.sunSurface, this.model.sun.modelMatrix, this.model.camera.viewMatrix, true);
    this.rendering.draw(this.earthSurface, this.model.earth.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmap, false);
    this.rendering.draw(this.earthMoonSurface, this.model.earthMoon.modelMatrix, this.model.camera.viewMatrix, this.model.camera.sunPositionEye, shadowmap, false);
};