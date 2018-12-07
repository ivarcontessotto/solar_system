"use strict";

/**
 * Creates a solid sphere object.
 *
 * @param gl The webgl context
 * @param latitudeBands The number of bands along the latitude direction
 * @param longitudeBands The number of bands along the longitude direction
 */
function SolidSphere(gl, latitudeBands, longitudeBands) {
    const buffers = initArrayBuffers();
    this.vertexPositionBuffer = buffers.vertexPositions;
    this.vertexNormalBuffer = buffers.vertexNormals;
    this.textureCoordinateBuffer = buffers.textureCoordinates;
    this.indexBuffer = initIndexBuffer();
    this.numberOfTriangles = latitudeBands * longitudeBands * 2;
    this.modelMatrix = mat4.create();

    function initArrayBuffers() {
        const vertexPositions = [];
        const vertexNormals  = [];
        const textureCoordinates = [];

        const latitudeStep = Math.PI / latitudeBands;
        const longitudeStep = 2 * Math.PI / longitudeBands;

        // Unit sphere with radius = 1
        for (let i = 0; i <= latitudeBands; i++) {
            const latitudeAngle = Math.PI / 2 - i * latitudeStep; // starting from PI/2 to -PI/2
            const y = Math.sin(latitudeAngle);
            const xz = Math.cos(latitudeAngle);

            for (let j = 0; j <= longitudeBands; j++) {
                const longitudeAngle = j * longitudeStep;   // starting form 0 to 2*PI
                const x = xz * Math.cos(longitudeAngle);
                const z = xz * Math.sin(longitudeAngle);

                vertexPositions.push(x);
                vertexPositions.push(y);
                vertexPositions.push(z);

                vertexNormals.push(x);
                vertexNormals.push(y);
                vertexNormals.push(z);

                textureCoordinates.push(j / longitudeBands);
                textureCoordinates.push(i / latitudeBands);
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
    }

    function initIndexBuffer() {
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
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalModelViewMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.vertexAttribPointer(ctx.aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexNormalId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.numberOfTriangles * 3 ,gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(ctx.aVertexPositionId);
    gl.disableVertexAttribArray(ctx.aVertexNormalId);
};