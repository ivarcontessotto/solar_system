/**
 * Helper function for the gl-matrix library.
 */

// Vec 3 --------------------------------------------------------------------------------------------------------------

function vec3Add(first, second) {
    return vec3.add(vec3.create(), first, second);
}

function vec3MultiplyScalar(vector, scalar) {
    return [
        vector[0] * scalar,
        vector[1] * scalar,
        vector[2] * scalar
    ];
}
function vec3HomogeneousToCartesian(homogeneous) {
    return vec3.fromValues(
        homogeneous[0] / homogeneous[3],
        homogeneous[1] / homogeneous[3],
        homogeneous[2] / homogeneous[3]);
}

// Vec 4 --------------------------------------------------------------------------------------------------------------

function vec4MultiplyMat4(vector, matrix) {
    return vec4.transformMat4(vec4.create(), vector, matrix);
}

function vec4CartessianToHomogeneous(cartesian) {
    return vec4.fromValues(cartesian[0], cartesian[1], cartesian[2], 1);
}

// Mat 3 --------------------------------------------------------------------------------------------------------------

function mat3NormalMatrixFromMat4(matrix) {
    return mat3.normalFromMat4(mat3.create(), matrix);
}

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

function mat4CreateTranslation(translationVector) {
    return mat4.fromTranslation(mat4.create(), translationVector);
}

function mat4CreateScaling(scalingVector) {
    return mat4.fromScaling(mat4.create(), scalingVector);
}