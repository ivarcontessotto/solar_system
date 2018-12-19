"use strict";

function Rendering(gl, buffers, projectionMatrix) {

    // todo split into different rendering classes
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

    // todo will not always  be the same for all rendering types
    const setUpProjectionMatrix = () => {
        this.gl.uniformMatrix4fv(this.shaderCtx.uProjectionMatrixId, false, projectionMatrix);
    };

    this.gl = gl;
    this.buffers = buffers;
    setUpShaderProgram();
    setUpProjectionMatrix();
}

Rendering.prototype.draw = function(modelMatrix, vieMatrix, surface, enableShading, sunPositionEye) {

    // todo split different rendering methods to its own classes

    // todo probably move to renderings that actually do lighting and need to know sunlight pos and color
    const setUpSunlight = () => {
        this.gl.uniform3fv(this.shaderCtx.uSunPositionEyeId, sunPositionEye);
        this.gl.uniform3fv(this.shaderCtx.uSunlightColorId,[1, 1, 1]);
    };

    this.gl.uniform1i(this.shaderCtx.uRenderShadowMapId, 0);

    const modelViewMatrix = mat4Multiply(vieMatrix, modelMatrix);
    this.gl.uniformMatrix4fv(this.shaderCtx.uModelViewMatrixId, false, modelViewMatrix);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.diffuseMap);
    this.gl.uniform1i(this.shaderCtx.uDiffuseMapId, 0);

    this.gl.activeTexture(this.gl.TEXTURE0 + 1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.specularMap);
    this.gl.uniform1i(this.shaderCtx.uSpecularMapId, 1);

    this.gl.activeTexture(this.gl.TEXTURE0 + 2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.ambientMap);
    this.gl.uniform1i(this.shaderCtx.uAmbientMapId, 2);

    this.gl.activeTexture(this.gl.TEXTURE0 + 3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, surface.cloudMap);
    this.gl.uniform1i(this.shaderCtx.uCloudMapId, 3);

    this.gl.uniform4f(this.shaderCtx.uPhongStrengthId, surface.phongStrength[0], surface.phongStrength[1], surface.phongStrength[2], surface.phongStrength[3]);
    this.gl.uniform2f(this.shaderCtx.uCloudStrengthId, surface.cloudStrength[0], surface.cloudStrength[1]);

    if (enableShading) {
        setUpSunlight();
        this.gl.uniform1i(this.shaderCtx.uEnableShadingId, 1);
        this.gl.uniformMatrix3fv(this.shaderCtx.uNormalMatrixId, false, mat3NormalMatrixFromMat4(modelViewMatrix));
    }
    else {
        this.gl.uniform1i(this.shaderCtx.uEnableShadingId, 0);
    }

    this.buffers.draw(this.gl, this.shaderCtx, enableShading);
};