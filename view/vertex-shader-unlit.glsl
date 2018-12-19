attribute vec3 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec2 aVertexTextureCoordinate;
varying vec2 vFragmentTextureCoordinate;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1);;
    vFragmentTextureCoordinate = aVertexTextureCoordinate;
}