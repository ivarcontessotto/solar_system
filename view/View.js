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

    const setUpLights = () => {
        this.gl.uniform3fv(this.shaderCtx.uLightPositionEyeId, this.model.lightPositionEye);
        this.gl.uniform3fv(this.shaderCtx.uLightColorId,[1, 0.95, 0.8]);
    };

    const createTexture = (item, index) => {
        item.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, item.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, item.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    };

    const bindTextures = () => {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureItems[0].texture);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureItems[1].texture);
    };

    let imagesToLoad = 0;

    const onImageLoad = () => {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            this.textureItems.forEach(createTexture);
            bindTextures();
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
        this.textureItems.push({url: "images/2k_sun.jpg"});
        this.textureItems.push({url: "images/2k_earth_daymap.jpg"});
        imagesToLoad = this.textureItems.length;
        this.textureItems.forEach(loadImage);
    };

    this.gl = createGLContext(canvas);
    this.model = model;
    this.textureSphere = new TextureSphere(this.gl, 20, 20);
    setUpShaderProgram();
    setUpHiddenSurfaceRemoval();
    setUpProjectionMatrix();
    setUpLights();
    this.gl.clearColor(0, 0, 0, 1);
    // This needs to be done last because images are loaded asynchronously in browser!
    loadTextureImages();
}

View.prototype.draw = function() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.textureSphere.draw(this.gl, this.shaderCtx, this.model.sun.modelMatrix, this.model.viewMatrix, 0, false);
    this.textureSphere.draw(this.gl, this.shaderCtx, this.model.earth.modelMatrix, this.model.viewMatrix, 1, true);
};