precision mediump float;

uniform sampler2D uTexture;
varying vec2 vFragmentTextureCoordinate;

void main() {
    gl_FragColor = vec4(texture2D(uTexture, vFragmentTextureCoordinate).rgb, 1);
}