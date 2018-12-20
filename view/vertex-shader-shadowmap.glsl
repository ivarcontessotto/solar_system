attribute vec3 aVertexPosition;
uniform mat4 uLightSpaceMatrix;

void main() {
    gl_Position = uLightSpaceMatrix * vec4(aVertexPosition, 1.0);;
}