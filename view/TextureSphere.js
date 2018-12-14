"use strict";

/**
 * Creates a solid sphere object.
 *
 * @param gl The webgl context
 * @param sectorCount The number of bands along the longitude direction
 * @param stackCount The number of bands along the latitude direction
 */
function TextureSphere(gl, sectorCount, stackCount) {

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

    // todo cleanup
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

    // todo move this out to view.
    const initTexture = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        return texture;
    };

    const buffers = initArrayBuffers();
    this.vertexPositionBuffer = buffers.vertexPositions;
    this.vertexNormalBuffer = buffers.vertexNormals;
    this.textureCoordinateBuffer = buffers.textureCoordinates;
    this.indexBuffer = initIndexBuffer();
    this.numberOfTriangles = (stackCount - 1) * sectorCount * 2;
}

// todo cleanup
TextureSphere.prototype.draw = function(gl, ctx, modelMatrix, vieMatrix, texture, enableShading) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, vieMatrix, this.modelMatrix);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
    gl.vertexAttribPointer(ctx.aTextureCoordinateId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aTextureCoordinateId);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(ctx.uTextureId, 0);

    if (this.enbaleShading) {
        gl.uniform1i(ctx.uEnableShadingId, 1);

        const normalModelViewMatrix = mat3.create();
        mat3.normalFromMat4(normalModelViewMatrix, modelViewMatrix);
        gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalModelViewMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.vertexAttribPointer(ctx.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexNormalId);
    }
    else {
        gl.uniform1i(ctx.uEnableShadingId, 0);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.numberOfTriangles * 3 ,gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(ctx.aVertexPositionId);
    gl.disableVertexAttribArray(ctx.aTextureCoordinateId);
    gl.disableVertexAttribArray(ctx.aVertexNormalId);
};