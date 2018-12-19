/*
 * Set of utilities for setting UP in WebGL
 *
 * Author: 		Thomas Koller
 * Adapted by: 	Ivar Contessotto
 *
 * V 1.0: 20-Oct-2014
 * V 2.0: 02-Nov-2014
 * V 3.0: 17-Sep-2016 (removed matrix operations)
 * V 4.0: 08-Oct-2018 (added canvas resize function, refactoring)
 *
 */

"use strict";

/**
 * Create and return the WebGL context
 *
 * @param canvas The canvas from which to get the context
 * @return {*} the WebGL context (wrapped into a debug context) if successful, null otherwise
 */
function createGLContext(canvas) {
    const context = canvas.getContext("webgl");
    if (!context) {
        console.log("Failed to create GL context!");
        return null;
    }
    return WebGLDebugUtils.makeDebugContext(context);
}

/**
 * Load and compile the shaders and return the shader Program
 * @param gl the gl context to use
 * @param vertexShaderFileName the name of the vertex shader source file
 * @param fragmentShaderFileName the name of the fragment shader source file
 * @returns {*} the shader program if successful, null otherwise
 */
function setupProgram(gl, vertexShaderFileName, fragmentShaderFileName) {
    const vertexShader = loadAndCompileShader(gl, gl.VERTEX_SHADER, vertexShaderFileName);
    const fragmentShader = loadAndCompileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderFileName);
    if (vertexShader === null || fragmentShader === null) {
        return null;
    }
    return createProgram(gl, vertexShader, fragmentShader);
}

/**
 * Load and compile a shader
 * @param gl the gl context to use
 * @param shaderType the shader type
 * @param shaderFileName name of the shader source file
 * @returns {*} the compiled shader if successful, null otherwise
 */
function loadAndCompileShader(gl, shaderType, shaderFileName) {
    const shaderSource = loadResource(shaderFileName);
    if (shaderSource == null) {
        console.log("Could not load shader file: " + shaderFileName);
        return null;
    }

    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Shader compilation error: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

/**
 * Link a compiled vertex and fragment shader to a shader program
 * @param gl the gl context to use
 * @param vertexShader the compiled vertex shader
 * @param fragmentShader the compiled fragment shader
 * @returns {*} the linked shader program if successful, null otherwise
 */
function createProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Failed to link program");
        return null;
    }
    return shaderProgram;
}

/**
 * Load a external resource synchronously from an URL.
 *
 * If the URL ends UP specifying a file (when the original HTML is read from the file system) then
 * some security settings of the browser might have been changed. If there is a local web server,
 * there should not be any problem.
 *
 * @param name The name of the resource to get
 * @returns {*} the content of the resource
 */
function loadResource(name) {
    const request = new XMLHttpRequest();
    request.open("GET", name, false);
    request.send(null);
    if (request.status === 200 || request.status === 0) {
        return request.responseText;
    } else {
        console.log("Error: loadFile status:" + request.statusText);
        console.log(request.status);
        console.log(request.statusText);
        console.log(request.toString());
        console.log(request.responseText);
        return null;
    }
}

/**
 *  Resize the canvas to its display size (size specified in CSS)
 *
 * @param canvas The canvas to resize
 */
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    if (canvas.width !== displayWidth) {
        canvas.width = displayWidth;
    }
    const displayHeight = canvas.clientHeight
    if (canvas.height !== displayHeight) {
        canvas.height = displayHeight;
    }
}
