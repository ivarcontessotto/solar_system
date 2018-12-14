"use strict";

function View(canvas, model, callback) {

    const setUpShaderProgram = () => {
        this.shaderCtx = {};
        this.shaderCtx.shaderProgram = setupProgram(this.gl, "view/vertex-shader.glsl", "view/fragment-shader.glsl");

        this.shaderCtx.aVertexPositionId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexPosition");
        this.shaderCtx.uModelViewMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uModelViewMatrix");
        this.shaderCtx.uProjectionMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uProjectionMatrix");
        this.shaderCtx.aTextureCoordinateId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexTextureCoordinate");
        this.shaderCtx.uTextureId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uTexture");
        this.shaderCtx.uEnableShadingId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uEnableShading");
        this.shaderCtx.aVertexNormalId = this.gl.getAttribLocation(this.shaderCtx.shaderProgram, "aVertexNormal");
        this.shaderCtx.uNormalMatrixId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uNormalMatrix");
        this.shaderCtx.uLightPositionEyeId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uLightPositionEye");
        this.shaderCtx.uLightColorId = this.gl.getUniformLocation(this.shaderCtx.shaderProgram, "uLightColor");
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

    const setUpLighting = () => {
        this.gl.uniform3fv(this.shaderCtx.uLightPositionEyeId, this.model.lightPositionEye);
        this.gl.uniform3fv(this.shaderCtx.uLightColorId,[1, 0.95, 0.8]);
    };

    const loadTextureImages = () => {
        this.textureImages = [];
        this.textureImages.push({url: "view/textures/2k_sun.jpg", image: null});
        this.textureImages.push({url: "view/textures/2k_earth_daymap.jpg", image: null});
        let imagesToLoad = this.textureImages.length;

        const onImageLoad = () => {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                callback();
            }
        };

        for (let i = 0; i < imagesToLoad; i++) {
            this.textureImages[i].image = loadImage(this.textureImages[i].url, onImageLoad);
        }
    };

    const loadImage = (url, callback) => {
        const image = new Image();
        image.onload = callback;
        image.src = url;
        return image;
    };

    // Initialize Object
    this.gl = createGLContext(canvas);
    this.model = model;
    setUpShaderProgram();
    setUpHiddenSurfaceRemoval();
    setUpProjectionMatrix();
    setUpLighting();
    // This needs to be done last because images are loaded asynchronously in browser!
    loadTextureImages();
}

View.prototype.draw = function() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // todo get matrices from model and pass to sphere draw
    // todo use the sphere viewmodel for it
    const sunModelMatrix = this.model.sun.modelMatrix;
    const earthModelMatrix = this.model.earth.modelMatrix;


};