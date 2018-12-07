"use strict";

window.onload = startup;

let startTime = null;
let radPerSecond = Math.PI/8;
let gl = null;
let textureImage = null;
let sun = null;
let planet = null;
let viewMatrix = null;
const ctx = {
    shaderProgram: null,
    aVertexPositionId: null,
    uModelViewMatrixId: null,
    uProjectionMatrixId: null,
    aVertexColorId: null,
    uEnableTextureId: null,
    aVertexTextureCoordinateId: null,
    uTextureId: null,
    uEnableLightingId: null,
    aVertexNormalId: null,
    uNormalMatrixId: null,
    uLightPositionEyeId: null,
    uEmissiveLightId: null
};

/**
 * Startup function to be called when the body is loaded.
 */
function startup() {
    main();
    // textureImage = new Image();
    // textureImage.onload = main;
    // textureImage.src = "../lena512.png";
}

/**
 * Main function
 */
function main() {
    const canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.requestAnimationFrame(startDrawing);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    ctx.shaderProgram = setupProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
    setUpAttributesAndUniforms();
    setUpHiddenSurfaceRemoval();
    gl.clearColor(0, 0, 0, 1);
    setUpCubeObjects();
    viewMatrix = createViewMatrix();
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, createProjectionMatrix());
    setUpLighting();
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.aVertexTextureCoordinateId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoordinate");
    ctx.uTextureId = gl.getUniformLocation(ctx.shaderProgram, "uTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uLightPositionEyeId = gl.getUniformLocation(ctx.shaderProgram, "uLightPositionEye");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uEmissiveLightId = gl.getUniformLocation(ctx.shaderProgram, "uEmissiveLight")
}

/**
 * Setup all webgl to not draw hidden surfaces
 */
function setUpHiddenSurfaceRemoval() {
    // back-face culling
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    gl.enable(gl.CULL_FACE);
    // depth buffer
    gl.enable(gl.DEPTH_TEST);
}

/**
 * Setup the cube objects to draw.
 */
function setUpCubeObjects() {
    sun = new ColorSphere(gl, 20, 20, [1, 1, 1]);
    sun.scale([100, 100, 100]);

    planet = new ColorSphere(gl, 20, 20, [0, 0, 1]);
    planet.scale([50, 50, 50]);
    planet.translate([500, 0, 0])
}

/**
 * Create the view matrix
 * Position and direction vectors in WORLD SPACE coordinates
 * @return {*} The view matrix
 */
function createViewMatrix() {
    const eye = [0, 300, 1000];
    const at = [0, 0, 0];
    const up = [0, 1, 0];
    const matrix = mat4.create();
    mat4.lookAt(matrix, eye, at, up);
    return matrix;
}

/**
 * Create the projection matrix
 * Positions are in VIEW SPACE (camera space) coordinates
 * @return {*} The projection matrix
 */
function createProjectionMatrix() {
    const fovy = Math.PI/4; // 45 degrees
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const zNear = 1;
    const zFar = 10000;
    const matrix = mat4.create();
    mat4.perspective(matrix, fovy, aspect, zNear, zFar);
    return matrix;
}
/**
 * Setup object independent lighting state.
 */
function setUpLighting() {
    gl.uniform1i(ctx.uEnableLightingId, 1);
    const lightPositionEye = vec4.create();
    vec4.transformMat4(lightPositionEye, [0, 0, 0, 1], viewMatrix);
    const lightPositionEye3 = [lightPositionEye[0] / lightPositionEye[3],
                                 lightPositionEye[1] / lightPositionEye[3],
                                 lightPositionEye[2] / lightPositionEye[3]];
    gl.uniform3fv(ctx.uLightPositionEyeId, lightPositionEye3);
    gl.uniform3fv(ctx.uLightColorId,[1, 0.9, 0.5]);
}

/**
 * Start drawing.
 * @param timeStamp
 */
function startDrawing(timeStamp) {
    startTime = timeStamp;
    window.requestAnimationFrame(draw);
}

/**
* Draw the scene
* @param timeStamp
*/
function draw(timeStamp) {
    const runtime = timeStamp - startTime;

    planet.rotate(seconds(runtime) * radPerSecond, [0, 1, 0]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(ctx.uEmissiveLightId, [1, 1, 1]);
    sun.draw(gl, ctx, viewMatrix);
    gl.uniform3fv(ctx.uEmissiveLightId, [0, 0, 0]);
    planet.draw(gl, ctx, viewMatrix);

    startTime = timeStamp;
    window.requestAnimationFrame(draw);
}

/**
 * Converts from milliseconds to seconds
 * @param runtime The runtime in milliseconds
 * @return {number} The runtime in seconds
 */
function seconds(runtime) {
    return runtime / 1000;
}
