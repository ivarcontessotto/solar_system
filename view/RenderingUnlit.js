"use strict";

function RenderingUnlit(gl, buffers, projectionMatrix) {

    const setUpShaderProgram = () => {
        this.shaderProgram = setupProgram(this.gl, "view/vertex-shader-unlit.glsl", "view/fragment-shader-unlit.glsl");
        this.gl.useProgram(this.shaderProgram);

        this.aVertexPositionId = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.uModelViewMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uModelViewMatrix");
        this.uProjectionMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
        this.aTextureCoordinateId = this.gl.getAttribLocation(this.shaderProgram, "aVertexTextureCoordinate");
        this.uTextureId = this.gl.getUniformLocation(this.shaderProgram, "uTexture");
    };

    this.gl = gl;
    this.buffers = buffers;
    setUpShaderProgram();
    this.gl.uniformMatrix4fv(this.uProjectionMatrixId, false, projectionMatrix);
}

RenderingUnlit.prototype.draw = function(surface, modelMatrix, viewMatrix, clearFramebuffer) {
    this.gl.useProgram(this.shaderProgram);

    if (clearFramebuffer) {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT, true);
    }

    this.gl.uniformMatrix4fv(this.uModelViewMatrixId, false, mat4Multiply(viewMatrix, modelMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.diffuseMap);
    this.gl.uniform1i(this.uTextureId, 0);

    this.buffers.drawPositionAndTexture(this.aVertexPositionId, this.aTextureCoordinateId);
};