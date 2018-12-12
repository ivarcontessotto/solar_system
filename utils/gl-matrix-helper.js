/**
 * Helper function for the gl-matrix library.
 */

function mat4Translate(translationVector, matrix) {
    return mat4.translate(mat4.create(), matrix, translationVector);
}

function mat4Rotate(angleRadians, axisVector, matrix) {
    return mat4.rotate(mat4.create(), matrix, angleRadians, axisVector);
}

function mat4CreateProjection(fovy, aspect, zNear, zFar) {
    return mat4.perspective(mat4.create(), fovy, aspect, zNear, zFar);
}

function mat4CreateLookAt(eye, at, up) {
    return mat4.lookAt(mat4.create(), eye, at, up);
}

function vec4MultiplyMat4(vector, matrix) {
    return vec4.transformMat4(vec4.create(), vector, matrix);
}

function vec3CartesianFromHomogeneous(homogeneous) {
    return vec3.fromValues(
        homogeneous[0] / homogeneous[3],
        homogeneous[1] / homogeneous[3],
        homogeneous[2] / homogeneous[3]);
}