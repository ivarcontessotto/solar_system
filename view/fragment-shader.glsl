precision mediump float;

varying vec2 vFragmentTextureCoordinate;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;

uniform bool uEnableShading;
uniform vec3 uLightPositionEye;
uniform vec3 uLightColor;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;
//const float ambientFactor = 0.1;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.6, 0.6, 0.6);

void main() {
    vec3 baseColorDay = texture2D(uDayTexture, vFragmentTextureCoordinate).rgb;

    if (uEnableShading) {
        vec3 lightDirection = normalize(uLightPositionEye - vFragmentPositionEye);
        vec3 normal = normalize(vFragmentNormalEye);

        // Diffuse Lighting
        float diffuseFactor = max(dot(normal, lightDirection), 0.0);
        vec3 diffuseColor = diffuseFactor * uLightColor * baseColorDay;

        // Specular Lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3  eyeDirection = normalize(-vFragmentPositionEye);
            vec3 reflectionDirection = reflect(-lightDirection, normal);
            float specularFactor = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
            specularColor = specularFactor * uLightColor * specularMaterialColor;
        }

        // Ambient lighting
        vec3 ambientColor = (0.5 - max(min(2.0*diffuseFactor, 1.0), 0.0)) * texture2D(uNightTexture, vFragmentTextureCoordinate).rgb;

        gl_FragColor = vec4(ambientColor + diffuseColor + specularColor, 1);
    }
    else {
        gl_FragColor = vec4(baseColorDay, 1);
    }
}
