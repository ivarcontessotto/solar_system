precision mediump float;

varying vec2 vFragmentTextureCoordinate;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uCloudTexture;
uniform sampler2D uSpecularTexture;

uniform bool uEnableShading;
uniform vec3 uSunPositionEye;
uniform vec3 uSunlightColor;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

const float shininess = 10.0;

void main() {
    vec3 baseColorDay = texture2D(uDayTexture, vFragmentTextureCoordinate).rgb + texture2D(uCloudTexture, vFragmentTextureCoordinate).rgb;

    if (uEnableShading) {
        vec3 lightDirection = normalize(uSunPositionEye - vFragmentPositionEye);
        vec3 normal = normalize(vFragmentNormalEye);

        // Diffuse Lighting
        float diffuseFactor = max(dot(normal, lightDirection), 0.0);
        vec3 diffuseColor = diffuseFactor * uSunlightColor * baseColorDay;

        // Specular Lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3  eyeDirection = normalize(-vFragmentPositionEye);
            vec3 reflectionDirection = reflect(-lightDirection, normal);
            float specularFactor = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
            specularColor = specularFactor * uSunlightColor * 0.5 * texture2D(uSpecularTexture, vFragmentTextureCoordinate).rgb;
        }

        // Ambient lighting
        vec3 baseColorNight = texture2D(uNightTexture, vFragmentTextureCoordinate).rgb +  0.1 * texture2D(uCloudTexture, vFragmentTextureCoordinate).rgb;;
        vec3 ambientColor = (0.75 - max(min(2.0 * diffuseFactor, 1.0), 0.0)) * baseColorNight;

        gl_FragColor = vec4(diffuseColor + specularColor + ambientColor, 1);
    }
    else {
        gl_FragColor = vec4(baseColorDay, 1);
    }
}
