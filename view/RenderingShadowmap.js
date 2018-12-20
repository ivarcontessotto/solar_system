"use strict";

function RenderingShadowmap(gl, buffers, mapWidth, mapHeight, lightProjectionViewMatrix) {

    const setUpShaderProgram = () => {
        this.shaderProgram = setupProgram(this.gl, "view/vertex-shader-shadowmap.glsl", "view/fragment-shader-shadowmap.glsl");
        this.gl.useProgram(this.shaderProgram);
        this.gl.getExtension("WEBGL_depth_texture");

        this.aVertexPositionId = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.uLightSpaceMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uLightSpaceMatrix");
    };

    // todo check if there are better parameters
    const createShadowmapTexture = () => {
        this.shadowmap = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.shadowmap);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, this.mapWidth, this.mapHeight, 0,
            this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_INT, null);
    };

    const createFrameBuffer = () => {
        this.frameBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT,
            this.gl.TEXTURE_2D, this.shadowmap, 0);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };

    this.gl = gl;
    this.buffers = buffers;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.lightProjectionViewMatrix = lightProjectionViewMatrix;
    setUpShaderProgram();
    createShadowmapTexture();
    createFrameBuffer();
}

RenderingShadowmap.prototype.draw = function(modelMatrix, clearFramebuffer) {
    this.gl.useProgram(this.shaderProgram);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    if (clearFramebuffer) {
        this.gl.clearColor(1, 1, 1, 1);
        this.gl.viewport(0, 0, SHADOWMAP_RESOLUTION, SHADOWMAP_RESOLUTION); // todo move those numbers
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    this.gl.uniformMatrix4fv(this.uLightSpaceMatrixId, false, mat4Multiply(this.lightProjectionViewMatrix, modelMatrix)); //todo change

    this.buffers.drawPosition(this.aVertexPositionId);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return this.shadowmap;
};