"use strict";

/**
 * Creates a colored sphere object.
 *
 * @param gl The webgl context
 * @param latitudeBands The number of bands along the latitude direction
 * @param longitudeBands The number of bands along the longitude direction
 * @param color The rgb color of the sphere.
 * @constructor
 */
function ColorSphere(gl, latitudeBands, longitudeBands, color) {
    SolidSphere.call(this, gl, latitudeBands, longitudeBands);
    this.color = color;
}

// Inherit from SolidSphere
ColorSphere.prototype = Object.create(SolidSphere.prototype);

ColorSphere.prototype.draw = function(gl, ctx, viewMatrix) {
    gl.uniform1i(ctx.uEnableTextureId, 0);
    gl.vertexAttrib3f(ctx.aVertexColorId, this.color[0], this.color[1], this.color[2]);
    gl.disableVertexAttribArray(ctx.aVertexColorId);  // Needs to be disabled for constant value.

    SolidSphere.prototype.draw.call(this, gl, ctx, viewMatrix);
};

Object.defineProperty(ColorSphere.prototype, "constructor", {
    value: ColorSphere,
    enumerable: false,
    writable: true
});