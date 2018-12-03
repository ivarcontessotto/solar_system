precision mediump float;

varying vec3 vColor;

uniform bool uEnableTexture;
varying vec2 vTextureCoordinate;
uniform sampler2D uSampler;

uniform bool uEnableLighting;
uniform vec3 uLightPositionEye3;
uniform vec3 uLightColor;
uniform vec3 uEmissiveLight;
varying vec3 vNormalEye;
varying vec3 vPositionEye3;
const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.6, 0.6, 0.6); // A specular strenght factor of 0.6 is already calculated in here.

void main() {
    // Set the base color depending whether we use a texture or normal coloring.
    vec3 baseColor;
    if (uEnableTexture) {
        baseColor = texture2D(uSampler, vTextureCoordinate).rgb;
    }
    else {
        baseColor = vColor;
    }

    if (uEnableLighting) {
        // Calculate L and N vectors
        vec3 lightDirection = normalize(uLightPositionEye3 - vPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // Ambient lighting with "white" light: abientFactor * (1, 1, 1) * baseColor
        vec3 ambientColor = ambientFactor * baseColor;

        // Diffuse Lighting
        float diffuseFactor = max(dot(normal, lightDirection), 0.0);
        vec3 diffuseColor = diffuseFactor * uLightColor * baseColor;

        // Specular Lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3  eyeDirection = normalize(-vPositionEye3);
            vec3 reflectionDirection = reflect(-lightDirection, normal);
            float specularFactor = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
            specularColor = specularFactor * uLightColor * specularMaterialColor;
        }

        // Calculate the final fragment color.
        gl_FragColor = vec4(ambientColor + diffuseColor + specularColor + uEmissiveLight, 1);
    }
    else {
        gl_FragColor = vec4(baseColor, 1);
    }
}
