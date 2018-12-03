"use strict";

/**
 * Creates a solid sphere object.
 *
 * @param gl The webgl context
 * @param latitudeBands The number of bands along the latitude direction
 * @param longitudeBands The number of bands along the longitude direction
 */
function SolidSphere(gl, latitudeBands, longitudeBands) {
    const buffers = defineVerticesAndNormals();
    this.positionBuffer = buffers.positionBuffer;
    this.normalBuffer = buffers.normalBuffer;
    this.indexBuffer = defineIndices();
    this.numberOfTriangles = latitudeBands * longitudeBands * 2;
    this.modelMatrix = mat4.create();

    function defineVerticesAndNormals() {
        const verticesSlashNormals = [];  // Vertices and normals are identical for this shape.

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            const theta = latNumber * Math.PI / latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                const phi = longNumber * 2 * Math.PI / longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                // position (and normals as it is a unit sphere)
                const x = cosPhi * sinTheta;
                const y = cosTheta;
                const z = sinPhi * sinTheta;

                verticesSlashNormals.push(x);
                verticesSlashNormals.push(y);
                verticesSlashNormals.push(z);
            }
        }
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesSlashNormals), gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesSlashNormals), gl.STATIC_DRAW);

        return {
            positionBuffer: positionBuffer,
            normalBuffer: normalBuffer
        };
    }

    function defineIndices() {
        const indices = [];
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const first = (latNumber * (longitudeBands + 1)) + longNumber;
                const second = first + longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1);
                indices.push(second);

                indices.push(second);
                indices.push(first + 1);
                indices.push(second + 1);
            }
        }
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return buffer;
    }
}

SolidSphere.prototype.scale = function(scalingVector) {
    const scalingMatrix = mat4.create();
    mat4.fromScaling(scalingMatrix, scalingVector);
    const newModelMatrix = mat4.create();
    mat4.multiply(newModelMatrix, scalingMatrix, this.modelMatrix);
    this.modelMatrix = newModelMatrix;
};

SolidSphere.prototype.rotate = function(angle, axis) {
    const rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, angle, axis);
    const newModelMatrix = mat4.create();
    mat4.multiply(newModelMatrix, rotationMatrix, this.modelMatrix);
    this.modelMatrix = newModelMatrix;
};

SolidSphere.prototype.translate = function(translationVector) {
    const translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    const newModelMatrix = mat4.create();
    mat4.multiply(newModelMatrix, translationMatrix, this.modelMatrix);
    this.modelMatrix = newModelMatrix;
};

SolidSphere.prototype.draw = function(gl, ctx, vieMatrix) {
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, vieMatrix, this.modelMatrix);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);

    const normalModelViewMatrix = mat3.create();
    mat3.normalFromMat4(normalModelViewMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalModelViewMatrixId, false, normalModelViewMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(ctx.aPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(ctx.aNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aNormalId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.numberOfTriangles * 3 ,gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(ctx.aPositionId);
    gl.disableVertexAttribArray(ctx.aNormalId);
};