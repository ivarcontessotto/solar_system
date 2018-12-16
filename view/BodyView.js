"use strict";

function BodyView(gl, sectorCount, stackCount) {

    const initArrayBuffers = () => {
        const vertexPositions = [];
        const vertexNormals  = [];
        const textureCoordinates = [];

        const stackStep = Math.PI / stackCount;
        const sectorStep = 2 * Math.PI / sectorCount;

        // Unit sphere with radius = 1
        for (let i = 0; i <= stackCount; i++) {
            const stackAngle = Math.PI / 2 - i * stackStep; // starting from PI/2 to -PI/2
            const y = Math.sin(stackAngle);
            const xz = Math.cos(stackAngle);

            for (let j = 0; j <= sectorCount; j++) {
                const sectorAngle = j * sectorStep;   // starting form 0 to 2*PI
                const x = xz * Math.sin(sectorAngle);
                const z = xz * Math.cos(sectorAngle);

                vertexPositions.push(x);
                vertexPositions.push(y);
                vertexPositions.push(z);

                vertexNormals.push(x);
                vertexNormals.push(y);
                vertexNormals.push(z);

                textureCoordinates.push(j / sectorCount);
                textureCoordinates.push(i / stackCount);
            }
        }
        const vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);

        const vertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

        const textureCoordinateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        return {
            vertexPositions: vertexPositionBuffer,
            vertexNormals: vertexNormalBuffer,
            textureCoordinates: textureCoordinateBuffer
        };
    };

    const initIndexBuffer = () => {
        const indices = [];
        for (let i = 0; i < stackCount; i++) {
            let beginCurrentStack = i * (sectorCount + 1);
            let beginNextStack = beginCurrentStack + sectorCount + 1;
            for (let j = 0; j < sectorCount; j++, beginCurrentStack++, beginNextStack++) {

                if (i !== 0) {
                    indices.push(beginCurrentStack);
                    indices.push(beginNextStack);
                    indices.push(beginCurrentStack + 1);
                }
                if (i !== (stackCount - 1)) {
                    indices.push(beginCurrentStack + 1);
                    indices.push(beginNextStack);
                    indices.push(beginNextStack + 1);
                }
            }
        }
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return buffer;
    };

    const buffers = initArrayBuffers();
    this.vertexPositionBuffer = buffers.vertexPositions;
    this.vertexNormalBuffer = buffers.vertexNormals;
    this.textureCoordinateBuffer = buffers.textureCoordinates;
    this.indexBuffer = initIndexBuffer();
    this.numberOfTriangles = (stackCount - 1) * sectorCount * 2;
}

BodyView.prototype.draw = function(gl, shaderCtx, modelMatrix, vieMatrix, surface, enableShading) {
    // todo omg cleanup this ugly function
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderCtx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderCtx.aVertexPositionId);

    const modelViewMatrix = mat4Multiply(vieMatrix, modelMatrix);
    gl.uniformMatrix4fv(shaderCtx.uModelViewMatrixId, false, modelViewMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
    gl.vertexAttribPointer(shaderCtx.aTextureCoordinateId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderCtx.aTextureCoordinateId);

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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.vertexAttribPointer(shaderCtx.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderCtx.aVertexNormalId);
    }
    else {
        gl.uniform1i(shaderCtx.uEnableShadingId, 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.numberOfTriangles * 3 ,gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(shaderCtx.aVertexPositionId);
    gl.disableVertexAttribArray(shaderCtx.aTextureCoordinateId);
    gl.disableVertexAttribArray(shaderCtx.aVertexNormalId);
};