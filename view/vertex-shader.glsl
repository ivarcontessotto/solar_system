attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec2 aVertexTextureCoordinate;
varying vec2 vFragmentTextureCoordinate;

attribute vec3 aVertexNormal;
uniform mat3 uNormalMatrix;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

uniform mat4 uLightSpaceMatrixPositiveX;
uniform mat4 uLightSpaceMatrixNegativeX;
uniform mat4 uLightSpaceMatrixPositiveZ;
uniform mat4 uLightSpaceMatrixNegativeZ;

varying vec3 vFragmentPositionLightspacePositiveX;
varying vec3 vFragmentPositionLightspaceNegativeX;
varying vec3 vFragmentPositionLightspacePositiveZ;
varying vec3 vFragmentPositionLightspaceNegativeZ;

void main() {

    vec4 vertexPosition4 =  vec4(aVertexPosition, 1.0);
    vec4 positionEye4 = uModelViewMatrix * vertexPosition4;

    gl_Position = uProjectionMatrix * positionEye4;
    vFragmentTextureCoordinate = aVertexTextureCoordinate;

    // Shading
    vFragmentPositionEye = positionEye4.xyz / positionEye4.w;
    vFragmentNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // Shadows
    vec4 fragmentPositionLightspacePositiveX4 = uLightSpaceMatrixPositiveX * vertexPosition4;
    vFragmentPositionLightspacePositiveX = fragmentPositionLightspacePositiveX4.xyz / fragmentPositionLightspacePositiveX4.w;
    vec4 fragmentPositionLightspaceNegativeX4 = uLightSpaceMatrixNegativeX * vertexPosition4;
    vFragmentPositionLightspaceNegativeX = fragmentPositionLightspaceNegativeX4.xyz / fragmentPositionLightspaceNegativeX4.w;
    vec4 fragmentPositionLightspacePositiveZ4 = uLightSpaceMatrixPositiveZ * vertexPosition4;
    vFragmentPositionLightspacePositiveZ = fragmentPositionLightspacePositiveZ4.xyz / fragmentPositionLightspacePositiveZ4.w;
    vec4 fragmentPositionLightspaceNegativeZ4 = uLightSpaceMatrixNegativeZ * vertexPosition4;
    vFragmentPositionLightspaceNegativeZ = fragmentPositionLightspaceNegativeZ4.xyz / fragmentPositionLightspaceNegativeZ4.w;
}