"use strict";

function View(canvas, model, callback) {

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

    const setUpShaderProgram = () => {
        this.shaderCtx = {};
        this.shaderCtx.shaderProgram = setupProgram(this.gl, "view/vertex-shader.glsl", "view/fragment-shader.glsl");

        this.shaderCtx.aVertexPositionId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexPosition");
        this.shaderCtx.uModelViewMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uModelViewMatrix");
        this.shaderCtx.uProjectionMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uProjectionMatrix");

        this.shaderCtx.aTextureCoordinateId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexTextureCoordinate");
        this.shaderCtx.uDiffuseMapId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uDiffuseMap");
        this.shaderCtx.uSpecularMapId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uSpecularMap");
        this.shaderCtx.uAmbientMapId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uAmbientMap");
        this.shaderCtx.uCloudMapId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uCloudMap");

        this.shaderCtx.uPhongStrengthId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uPhongStrength");
        this.shaderCtx.uCloudStrengthId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uCloudStrength");

        this.shaderCtx.uEnableShadingId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uEnableShading");
        this.shaderCtx.aVertexNormalId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexNormal");
        this.shaderCtx.uNormalMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uNormalMatrix");
        this.shaderCtx.uSunPositionEyeId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uSunPositionEye");
        this.shaderCtx.uSunlightColorId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uSunlightColor");

        this.shaderCtx.uRenderShadowMapId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uRenderShadowMap");
        this.shaderCtx.uModelLightMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uModelLightMatrix");
    };

    const setUpHiddenSurfaceRemoval = () => {
        // back-face culling
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        this.gl.enable(this.gl.CULL_FACE);
        // depth buffer
        this.gl.enable(this.gl.DEPTH_TEST);
    };

    const setUpProjectionMatrix = () => {
        this.gl.uniformMatrix4fv(this.shaderCtx.uProjectionMatrixId, false, this.model.projectionMatrix);
    };

    const createTexture = (item, index) => {
        item.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, item.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, item.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

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

    this.gl = createGLContext(canvas);
    console.log(this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS));
    this.model = model;
    this.bodyView = new BodyView(this.gl, 50, 50);
    setUpShaderProgram();
    setUpHiddenSurfaceRemoval();
    setUpProjectionMatrix();
    this.gl.clearColor(0, 0, 0, 1);
    // This needs to be done last because images are loaded asynchronously in browser!
    loadTextureImages();
}

View.prototype.draw = function() {

    const setUpSunlight = () => {
        this.gl.uniform3fv(this.shaderCtx.uSunPositionEyeId, this.model.sunPositionEye);
        this.gl.uniform3fv(this.shaderCtx.uSunlightColorId,[1, 1, 1]);
    };

    setUpSunlight();

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.bodyView.draw(this.gl, this.shaderCtx, this.model.sun.modelMatrix, this.model.viewMatrix, this.sunSurface, false);
    this.bodyView.draw(this.gl, this.shaderCtx, this.model.earth.modelMatrix, this.model.viewMatrix, this.earthSurface, true);
    this.bodyView.draw(this.gl, this.shaderCtx, this.model.earthMoon.modelMatrix, this.model.viewMatrix, this.earthMoonSurface, true);
};