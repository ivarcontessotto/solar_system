precision mediump float;

varying vec2 vFragmentTextureCoordinate;
uniform sampler2D uTexture;

uniform bool uEnableShading;
uniform vec3 uLightPositionEye;
uniform vec3 uLightColor;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;
const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.6, 0.6, 0.6);

void main() {
    vec3 baseColor = texture2D(uTexture, vFragmentTextureCoordinate).rgb;

    if (uEnableShading) {
        vec3 lightDirection = normalize(uLightPositionEye - vFragmentPositionEye);
        vec3 normal = normalize(vFragmentNormalEye);

        // Ambient lighting
        vec3 ambientColor = ambientFactor * baseColor;

        // Diffuse Lighting
        float diffuseFactor = max(dot(normal, lightDirection), 0.0);
        vec3 diffuseColor = diffuseFactor * uLightColor * baseColor;

        // Specular Lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3  eyeDirection = normalize(-vFragmentPositionEye);
            vec3 reflectionDirection = reflect(-lightDirection, normal);
            float specularFactor = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
            specularColor = specularFactor * uLightColor * specularMaterialColor;
        }

        gl_FragColor = vec4(ambientColor + diffuseColor + specularColor, 1);
    }
    else {
        gl_FragColor = vec4(baseColor, 1);
    }
}
