attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec2 aVertexTextureCoordinate;
varying vec2 vFragmentTextureCoordinate;

attribute vec3 aVertexNormal;
uniform mat3 uNormalMatrix;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

uniform mat4 uLightSpaceMatrix;
varying vec4 vFragmentPositionLightspace;

void main() {

    vec4 positionEye4 = uModelViewMatrix * vec4(aVertexPosition, 1.0);

    gl_Position = uProjectionMatrix * positionEye4;
    vFragmentTextureCoordinate = aVertexTextureCoordinate;

    // Shading
    vFragmentPositionEye = positionEye4.xyz / positionEye4.w;
    vFragmentNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // Shadows
    vec4 positionLightspace4 = uLightSpaceMatrix * vec4(aVertexPosition, 1.0);
    vFragmentPositionLightspace = positionLightspace4; //positionLightspace4.xyz / positionLightspace4.w;
}