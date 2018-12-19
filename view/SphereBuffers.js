"use strict";

function SphereBuffers(gl, sectorCount, stackCount) {

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
       this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);

        this.vertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

        this.textureCoordinateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
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
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    };

    this.gl = gl;
    initArrayBuffers();
    initIndexBuffer();
    this.numberOfTriangles = (stackCount - 1) * sectorCount * 2;
}

SphereBuffers.prototype.drawWithNormals = function(aVertexPositionId, aTextureCoordinateId, aVertexNormalId) {

    enableAttribute(this.gl, this.vertexPositionBuffer, aVertexPositionId, 3);
    enableAttribute(this.gl, this.textureCoordinateBuffer, aTextureCoordinateId, 2);
    enableAttribute(this.gl, this.vertexNormalBuffer, aVertexNormalId, 3);

    drawElements(this.gl, this.indexBuffer, this.numberOfTriangles * 3);

    this.gl.disableVertexAttribArray(aVertexPositionId);
    this.gl.disableVertexAttribArray(aTextureCoordinateId);
    this.gl.disableVertexAttribArray(aVertexNormalId);
};

SphereBuffers.prototype.drawWithoutNormals = function(aVertexPositionId, aTextureCoordinateId) {

    enableAttribute(this.gl, this.vertexPositionBuffer, aVertexPositionId, 3);
    enableAttribute(this.gl, this.textureCoordinateBuffer, aTextureCoordinateId, 2);

    drawElements(this.gl, this.indexBuffer, this.numberOfTriangles * 3);

    this.gl.disableVertexAttribArray(aVertexPositionId);
    this.gl.disableVertexAttribArray(aTextureCoordinateId);
};

function enableAttribute(gl, attributeBuffer, attributeId, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
    gl.vertexAttribPointer(attributeId, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeId);
}

function drawElements(gl, indexBuffer, count) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
}