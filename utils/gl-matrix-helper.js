/**
 * Helper function for the gl-matrix library.
 */

// Mat 4 --------------------------------------------------------------------------------------------------------------

function mat4Multiply(leftMatrix, rightMatrix) {
    return mat4.multiply(mat4.create(), leftMatrix, rightMatrix);
}

function mat4TranslatePreMul(matrix, translationVector) {
    return mat4Multiply(mat4.fromTranslation(mat4.create(), translationVector), matrix);
}

function mat4RotatePreMul(matrix, angleRadians, axisVector) {
    return mat4Multiply(mat4.fromRotation(mat4.create(), angleRadians, axisVector), matrix);
}

function mat4CreateProjection(fovy, aspect, zNear, zFar) {
    return mat4.perspective(mat4.create(), fovy, aspect, zNear, zFar);
}

function mat4CreateLookAt(eye, at, up) {
    return mat4.lookAt(mat4.create(), eye, at, up);
}

// Vec 4 --------------------------------------------------------------------------------------------------------------

function vec4MultiplyMat4(vector, matrix) {
    return vec4.transformMat4(vec4.create(), vector, matrix);
}

// Vec 3 --------------------------------------------------------------------------------------------------------------

function vec3CartesianFromHomogeneous(homogeneous) {
    return vec3.fromValues(
        homogeneous[0] / homogeneous[3],
        homogeneous[1] / homogeneous[3],
        homogeneous[2] / homogeneous[3]);
}

function vec3MultiplyScalar(vector, scalar) {
    return [
        vector[0] * scalar,
        vector[1] * scalar,
        vector[2] * scalar
    ];
}