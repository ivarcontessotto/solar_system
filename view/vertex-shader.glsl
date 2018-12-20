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

varying vec4 vFragmentPositionLightspacePositiveX;
varying vec4 vFragmentPositionLightspaceNegativeX;
varying vec4 vFragmentPositionLightspacePositiveZ;
varying vec4 vFragmentPositionLightspaceNegativeZ;

void main() {

    vec4 vertexPosition4 =  vec4(aVertexPosition, 1.0);
    vec4 positionEye4 = uModelViewMatrix * vertexPosition4;

    gl_Position = uProjectionMatrix * positionEye4;
    vFragmentTextureCoordinate = aVertexTextureCoordinate;

    // Shading
    vFragmentPositionEye = positionEye4.xyz / positionEye4.w;
    vFragmentNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // Shadows
    vFragmentPositionLightspacePositiveX = uLightSpaceMatrixPositiveX * vertexPosition4;
    vFragmentPositionLightspaceNegativeX = uLightSpaceMatrixNegativeX * vertexPosition4;
    vFragmentPositionLightspacePositiveZ = uLightSpaceMatrixPositiveZ * vertexPosition4;
    vFragmentPositionLightspaceNegativeZ = uLightSpaceMatrixNegativeZ * vertexPosition4;
}