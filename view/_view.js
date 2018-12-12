// "use strict";

// let startTime = null;
// let gl = null;
// let textures = null;
// let sun = null;
// let planet = null;
// let viewMatrix = null;
// const ctx = {
//     shaderProgram: null,
//     aVertexPositionId: null,
//     uModelViewMatrixId: null,
//     uProjectionMatrixId: null,
//     aTextureCoordinateId: null,
//     uTextureId: null,
//     uEnableShadingId: null,
//     aVertexNormalId: null,
//     uNormalMatrixId: null,
//     uLightPositionEyeId: null
// };

// function startup() {
//     textures = [
//         { url: "view/textures/2k_sun.jpg", image: null},
//         { url: "view/textures/2k_earth_daymap.jpg", image: null}
//     ];
//     let imagesToLoad = textures.length;
//
//     const onImageLoad = function() {
//         imagesToLoad--;
//         if (imagesToLoad === 0) {
//             main();
//         }
//     };
//
//     for (let i = 0; i < imagesToLoad; i++) {
//         textures[i].image = loadImage(textures[i].url, onImageLoad);
//     }
// }

// function loadImage(url, callback) {
//     const image = new Image();
//     image.onload = callback;
//     image.src = url;
//     return image;
// }

// function main() {
//     const canvas = document.getElementById("myCanvas");
//     resizeCanvasToDisplaySize(canvas);
//     gl = createGLContext(canvas);
//     initGL();
//     window.requestAnimationFrame(startDrawing);
// }

// function initGL() {
//     ctx.shaderProgram = setupProgram(gl, "view/vertex-shader.glsl", "view/fragment-shader.glsl");
//     setUpAttributesAndUniforms();
//     setUpHiddenSurfaceRemoval();
//     gl.clearColor(0, 0, 0, 1);
//     setUpObjects();
//     viewMatrix = createViewMatrix();
//     gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, createProjectionMatrix());
//     setUpLighting();
// }

// function setUpAttributesAndUniforms(){
//     ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
//     ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
//     ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
//     ctx.aTextureCoordinateId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoordinate");
//     ctx.uTextureId = gl.getUniformLocation(ctx.shaderProgram, "uTexture");
//     ctx.uEnableShadingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableShading");
//     ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
//     ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
//     ctx.uLightPositionEyeId = gl.getUniformLocation(ctx.shaderProgram, "uLightPositionEye");
//     ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
// }

// function setUpHiddenSurfaceRemoval() {
//     // back-face culling
//     gl.frontFace(gl.CCW);
//     gl.cullFace(gl.BACK);
//     gl.enable(gl.CULL_FACE);
//     // depth buffer
//     gl.enable(gl.DEPTH_TEST);
// }

// function setUpObjects() {
//     sun = new TextureSphere(gl, 20, 20, textures[0].image, false);
//     sun.scale([100, 100, 100]);
//
//     planet = new TextureSphere(gl, 20, 20, textures[1].image, true);
//     planet.scale([100, 100, 100]);
//     planet.translate([500, 0, 0])
// }

// function createViewMatrix() {
//     const eye = [0, 300, 1000];
//     const at = [0, 0, 0];
//     const up = [0, 1, 0];
//     const matrix = mat4.create();
//     mat4.lookAt(matrix, eye, at, up);
//     return matrix;
// }

// function createProjectionMatrix() {
//     const verticalFieldOfView = Math.PI/4; // 45 degrees
//     const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
//     const zNear = 1;
//     const zFar = 10000;
//     const matrix = mat4.create();
//     mat4.perspective(matrix, verticalFieldOfView, aspect, zNear, zFar);
//     return matrix;
// }

// function setUpLighting() {
//     const lightPositionEye = vec4.create();
//     vec4.transformMat4(lightPositionEye, [0, 0, 0, 1], viewMatrix);
//     const lightPositionEye3 = [
//         lightPositionEye[0] / lightPositionEye[3],
//         lightPositionEye[1] / lightPositionEye[3],
//         lightPositionEye[2] / lightPositionEye[3]
//     ];
//     gl.uniform3fv(ctx.uLightPositionEyeId, lightPositionEye3);
//     gl.uniform3fv(ctx.uLightColorId,[1, 0.95, 0.8]);
// }

// function startDrawing(timeStamp) {
//     startTime = timeStamp;
//     window.requestAnimationFrame(draw);
// }

// function draw(timeStamp) {
//     const runtime = timeStamp - startTime;
//
//     // Model transformations
//     sun.rotateAroundOwnAxis(seconds(runtime) * Math.PI / 64, [0, 1, 0]);
//     planet.rotateInOrigin(seconds(runtime) * Math.PI / 8, [0, 1, 0]);
//     planet.rotateAroundOwnAxis(seconds(runtime) * Math.PI / 16, [0, 1, 0]);
//
//     // Draw the scene
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     sun.draw(gl, ctx, viewMatrix);
//     planet.draw(gl, ctx, viewMatrix);
//
//     startTime = timeStamp;
//     window.requestAnimationFrame(draw);
// }

// function seconds(runtime) {
//     return runtime / 1000;
// }