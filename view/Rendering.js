"use strict";

function Rendering(gl, buffers, projectionMatrix, lightProjectionViewMatrices) {

    // todo split into different rendering classes
    const setUpShaderProgram = () => {
        this.shaderProgram = setupProgram(this.gl, "view/vertex-shader.glsl", "view/fragment-shader.glsl");
        this.gl.useProgram(this.shaderProgram);

        this.aVertexPositionId = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.uModelViewMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uModelViewMatrix");
        this.uProjectionMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");

        this.aTextureCoordinateId = this.gl.getAttribLocation(this.shaderProgram, "aVertexTextureCoordinate");
        this.uDiffuseMapId = this.gl.getUniformLocation(this.shaderProgram, "uDiffuseMap");
        this.uSpecularMapId = this.gl.getUniformLocation(this.shaderProgram, "uSpecularMap");
        this.uAmbientMapId = this.gl.getUniformLocation(this.shaderProgram, "uAmbientMap");
        this.uCloudMapId = this.gl.getUniformLocation(this.shaderProgram, "uCloudMap");

        this.uPhongStrengthId = this.gl.getUniformLocation(this.shaderProgram, "uPhongStrength");
        this.uCloudStrengthId = this.gl.getUniformLocation(this.shaderProgram, "uCloudStrength");

        this.aVertexNormalId = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
        this.uNormalMatrixId = this.gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
        this.uSunPositionEyeId = this.gl.getUniformLocation(this.shaderProgram, "uSunPositionEye");
        this.uSunlightColorId = this.gl.getUniformLocation(this.shaderProgram, "uSunlightColor");

        this.uShadowmapPositiveXId = this.gl.getUniformLocation(this.shaderProgram, "uShadowmapPositiveX");
        this.uShadowmapNegativeXId = this.gl.getUniformLocation(this.shaderProgram, "uShadowmapNegativeX");
        this.uShadowmapPositiveZId = this.gl.getUniformLocation(this.shaderProgram, "uShadowmapPositiveZ");
        this.uShadowmapNegativeZId = this.gl.getUniformLocation(this.shaderProgram, "uShadowmapNegativeZ");
        this.uLightSpaceMatrixPositiveXId = this.gl.getUniformLocation(this.shaderProgram, "uLightSpaceMatrixPositiveX");
        this.uLightSpaceMatrixNegativeXId = this.gl.getUniformLocation(this.shaderProgram, "uLightSpaceMatrixNegativeX");
        this.uLightSpaceMatrixPositiveZId = this.gl.getUniformLocation(this.shaderProgram, "uLightSpaceMatrixPositiveZ");
        this.uLightSpaceMatrixNegativeZId = this.gl.getUniformLocation(this.shaderProgram, "uLightSpaceMatrixNegativeZ");
    };

    // todo will not always  be the same for all rendering types
    this.gl = gl;
    this.buffers = buffers;
    this.lightProjectionViewMatrices = lightProjectionViewMatrices;
    setUpShaderProgram();
    this.gl.uniformMatrix4fv(this.uProjectionMatrixId, false, projectionMatrix);
}

Rendering.prototype.draw = function(surface, modelMatrix, viewMatrix, sunPositionEye, shadowmaps, clearFramebuffer) {

    // todo split different rendering methods to its own classes

    this.gl.useProgram(this.shaderProgram);

    if (clearFramebuffer) {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT, true);
    }

    const modelViewMatrix = mat4Multiply(viewMatrix, modelMatrix);
    this.gl.uniformMatrix4fv(this.uModelViewMatrixId, false, modelViewMatrix);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.diffuseMap);
    this.gl.uniform1i(this.uDiffuseMapId, 0);

    this.gl.activeTexture(this.gl.TEXTURE0 + 1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.specularMap);
    this.gl.uniform1i(this.uSpecularMapId, 1);

    this.gl.activeTexture(this.gl.TEXTURE0 + 2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.ambientMap);
    this.gl.uniform1i(this.uAmbientMapId, 2);

    this.gl.activeTexture(this.gl.TEXTURE0 + 3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.cloudMap);
    this.gl.uniform1i(this.uCloudMapId, 3);

    this.gl.uniform4f(this.uPhongStrengthId, surface.phongStrength[0], surface.phongStrength[1], surface.phongStrength[2], surface.phongStrength[3]);
    this.gl.uniform2f(this.uCloudStrengthId, surface.cloudStrength[0], surface.cloudStrength[1]);

    this.gl.uniform3fv(this.uSunPositionEyeId, sunPositionEye);
    this.gl.uniform3fv(this.uSunlightColorId,[1, 1, 1]);
    this.gl.uniformMatrix3fv(this.uNormalMatrixId, false, mat3NormalMatrixFromMat4(modelViewMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0 + 4);
    this.gl.bindTexture(this.gl.TEXTURE_2D, shadowmaps[0]);
    this.gl.uniform1i(this.uShadowmapPositiveXId, 4);
    this.gl.uniformMatrix4fv(this.uLightSpaceMatrixPositiveXId, false, mat4Multiply(this.lightProjectionViewMatrices[0], modelMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0 + 5);
    this.gl.bindTexture(this.gl.TEXTURE_2D, shadowmaps[1]);
    this.gl.uniform1i(this.uShadowmapNegativeXId, 5);
    this.gl.uniformMatrix4fv(this.uLightSpaceMatrixNegativeXId, false, mat4Multiply(this.lightProjectionViewMatrices[1], modelMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0 + 6);
    this.gl.bindTexture(this.gl.TEXTURE_2D, shadowmaps[2]);
    this.gl.uniform1i(this.uShadowmapPositiveZId, 6);
    this.gl.uniformMatrix4fv(this.uLightSpaceMatrixPositiveZId, false, mat4Multiply(this.lightProjectionViewMatrices[2], modelMatrix));

    this.gl.activeTexture(this.gl.TEXTURE0 + 7);
    this.gl.bindTexture(this.gl.TEXTURE_2D, shadowmaps[3]);
    this.gl.uniform1i(this.uShadowmapNegativeZId, 7);
    this.gl.uniformMatrix4fv(this.uLightSpaceMatrixNegativeZId, false, mat4Multiply(this.lightProjectionViewMatrices[3], modelMatrix));

    this.buffers.drawAll(this.aVertexPositionId, this.aTextureCoordinateId, this.aVertexNormalId);
};