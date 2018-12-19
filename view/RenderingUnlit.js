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

RenderingUnlit.prototype.draw = function(surface, modelMatrix, viewMatrix) {
    this.gl.useProgram(this.shaderProgram);

    this.gl.uniformMatrix4fv(this.uModelViewMatrixId, false, mat4Multiply(viewMatrix, modelMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.diffuseMap);
    this.gl.uniform1i(this.uTextureId, 0);

    this.buffers.drawWithoutNormals(this.aVertexPositionId, this.aTextureCoordinateId);
};