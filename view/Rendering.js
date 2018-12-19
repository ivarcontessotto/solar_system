"use strict";

function Rendering(buffers) {
    this.buffers = buffers;
}

Rendering.prototype.draw = function(gl, shaderCtx, modelMatrix, vieMatrix, surface, enableShading) {

    // todo split different rendering methods to its own classes

    gl.uniform1i(shaderCtx.uRenderShadowMapId, 0);

    const modelViewMatrix = mat4Multiply(vieMatrix, modelMatrix);
    gl.uniformMatrix4fv(shaderCtx.uModelViewMatrixId, false, modelViewMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, surface.diffuseMap);
    gl.uniform1i(shaderCtx.uDiffuseMapId, 0);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, surface.specularMap);
    gl.uniform1i(shaderCtx.uSpecularMapId, 1);

    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, surface.ambientMap);
    gl.uniform1i(shaderCtx.uAmbientMapId, 2);

    gl.activeTexture(gl.TEXTURE0 + 3);
    gl.bindTexture(gl.TEXTURE_2D, surface.cloudMap);
    gl.uniform1i(shaderCtx.uCloudMapId, 3);

    gl.uniform4f(shaderCtx.uPhongStrengthId, surface.phongStrength[0], surface.phongStrength[1], surface.phongStrength[2], surface.phongStrength[3]);
    gl.uniform2f(shaderCtx.uCloudStrengthId, surface.cloudStrength[0], surface.cloudStrength[1]);

    if (enableShading) {
        gl.uniform1i(shaderCtx.uEnableShadingId, 1);
        gl.uniformMatrix3fv(shaderCtx.uNormalMatrixId, false, mat3NormalMatrixFromMat4(modelViewMatrix));
    }
    else {
        gl.uniform1i(shaderCtx.uEnableShadingId, 0);
    }

    this.buffers.draw(gl, shaderCtx, enableShading);
};