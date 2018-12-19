attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec2 aVertexTextureCoordinate;
varying vec2 vFragmentTextureCoordinate;

attribute vec3 aVertexNormal;
uniform mat3 uNormalMatrix;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

uniform bool uRenderShadowmap;
uniform mat4 uModelLightMatrix;

void main() {

    // todo move to shadowmapping shader
    if (uRenderShadowmap) {
        gl_Position = uModelLightMatrix * vec4(aVertexPosition, 1);
        return;
    }

    vec4 positionEye4 = uModelViewMatrix * vec4(aVertexPosition, 1);

    gl_Position = uProjectionMatrix * positionEye4;
    vFragmentTextureCoordinate = aVertexTextureCoordinate;

    // Shading
    vFragmentPositionEye = positionEye4.xyz / positionEye4.w;
    vFragmentNormalEye = normalize(uNormalMatrix * aVertexNormal);
}