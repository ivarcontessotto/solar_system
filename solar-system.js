"use strict";

window.onload = startup;

let startTime = null;
let radPerSecond = Math.PI/8;
let gl = null;
let textures = null;
let sun = null;
let planet = null;
let viewMatrix = null;
const ctx = {
    shaderProgram: null,
    aVertexPositionId: null,
    uModelViewMatrixId: null,
    uProjectionMatrixId: null,
    aTextureCoordinateId: null,
    uTextureId: null,
    uEnableLightingId: null,
    aVertexNormalId: null,
    uNormalMatrixId: null,
    uLightPositionEyeId: null,
    uEmissiveLightId: null
};

/**
 * Startup function to be called when the body is loaded.
 * Loads all the texture images needed.
 */
function startup() {
    textures = [
        { url: "textures/sunmap.jpg", image: null},
        { url: "textures/earthmap1k.jpg", image: null}
    ];
    let imagesToLoad = textures.length;

    const onImageLoad = function() {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            main();
        }
    };

    for (let i = 0; i < imagesToLoad; i++) {
        textures[i].image = loadImage(textures[i].url, onImageLoad);
    }
}

/**
 * Loads a texture image asynchronously.
 * @param url The url to the image.
 * @param callback The callback method for when the image is loaded.
 * @return {*} The image object.
 */
function loadImage(url, callback) {
    const image = new Image();
    image.onload = callback;
    image.src = url;
    return image;
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
    setUpObjects();
    viewMatrix = createViewMatrix();
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, createProjectionMatrix());
    setUpLighting();
    console.log(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.aTextureCoordinateId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoordinate");
    ctx.uTextureId = gl.getUniformLocation(ctx.shaderProgram, "uTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uLightPositionEyeId = gl.getUniformLocation(ctx.shaderProgram, "uLightPositionEye");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
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
 * Setup the objects to draw.
 */
function setUpObjects() {
    sun = new TextureSphere(gl, 20, 20, textures[0].image);
    sun.scale([100, 100, 100]);

    planet = new TextureSphere(gl, 20, 20, textures[1].image);
    planet.scale([100, 100, 100]);
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
    const lightPositionEye = vec4.create();
    vec4.transformMat4(lightPositionEye, [0, 0, 0, 1], viewMatrix);
    const lightPositionEye3 = [lightPositionEye[0] / lightPositionEye[3],
                                 lightPositionEye[1] / lightPositionEye[3],
                                 lightPositionEye[2] / lightPositionEye[3]];
    gl.uniform3fv(ctx.uLightPositionEyeId, lightPositionEye3);
    gl.uniform3fv(ctx.uLightColorId,[1, 0.95, 0.8]);
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

    // Model transformation
    // todo calculate the translation vector dynamically. doesnt work if planet rotates around sun
    planet.translate([-500, 0, 0]);
    planet.rotate(seconds(runtime) * radPerSecond, [0, 1, 0]);
    planet.translate([500, 0, 0]);
    //planet.rotate(seconds(runtime) * radPerSecond, [0, 1, 0]);

    // Draw the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(ctx.uEnableLightingId, 0); // The sun represents the light, so no lighting enabled  for it.
    sun.draw(gl, ctx, viewMatrix);
    gl.uniform1i(ctx.uEnableLightingId, 1);
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
