attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aColor;
varying vec3 vColor;

uniform bool uEnableTexture;
attribute vec2 aTextureCoordinate;
varying vec2 vTextureCoordinate;

uniform bool uEnableLighting;
attribute vec3 aNormal;
uniform mat3 uNormalModelViewMatrix;
varying vec3 vNormalEye;
varying vec3 vPositionEye3;

void main() {
    // Calculate the vertex position in eye coordinates for fragment shader.
    vec4 positionEye4 = uModelViewMatrix * vec4(aPosition, 1);
    // Calculate the projected position.
    gl_Position = uProjectionMatrix * positionEye4;

    if (uEnableLighting) {
        // Calculate cartesian coordinates of current vertex in eye coordinates for fragment shader.
        vPositionEye3 = positionEye4.xyz / positionEye4.w;
        // Calculate the normal vector in eye coordinates for fragment shader.
        vNormalEye = normalize(uNormalModelViewMatrix * aNormal);
    }

    // Set color or texture coordinates for fragment shader
    if (uEnableTexture) {
        vTextureCoordinate = aTextureCoordinate;
    }
    else {
        vColor = aColor;
    }
}
