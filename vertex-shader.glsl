attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aVertexColor;
varying vec3 vFragmentColor;

uniform bool uEnableTexture;
attribute vec2 aVertexTextureCoordinate;
varying vec2 vFragmentTextureCoordinate;

uniform bool uEnableLighting;
attribute vec3 aVertexNormal;
uniform mat3 uNormalMatrix;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

void main() {
    vec4 positionEye4 = uModelViewMatrix * vec4(aVertexPosition, 1);
    gl_Position = uProjectionMatrix * positionEye4;

    if (uEnableLighting) {
        vFragmentPositionEye = positionEye4.xyz / positionEye4.w;
        vFragmentNormalEye = normalize(uNormalMatrix * aVertexNormal);
    }

    if (uEnableTexture) {
        vFragmentTextureCoordinate = aVertexTextureCoordinate;
    }
    else {
        vFragmentColor = aVertexColor;
    }
}
