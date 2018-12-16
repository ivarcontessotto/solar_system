precision mediump float;

// todo pass strength factors for different textures with uniforms

varying vec2 vFragmentTextureCoordinate;

uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;

uniform sampler2D uCloudTexture;
const float cloudSrengthDay = 1.0;
const float cloudStrengthNight = 0.1;

uniform sampler2D uSpecularTexture;
const float shininess = 10.0;
const float specularStrength = 0.5;

const float ambientStrength = 0.75;

uniform bool uEnableShading;
uniform vec3 uSunlightColor;
uniform vec3 uSunPositionEye;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

void main() {
    vec3 baseColorCloud = texture2D(uCloudTexture, vFragmentTextureCoordinate).rgb;
    vec3 baseColorDay = texture2D(uDayTexture, vFragmentTextureCoordinate).rgb + cloudSrengthDay * baseColorCloud;

    if (uEnableShading) {
        vec3 fragmentLightDirection = normalize(uSunPositionEye - vFragmentPositionEye);
        vec3 fragmentNormal = normalize(vFragmentNormalEye);

        // Diffuse Lighting, Specular Lighting
        vec3 diffuseColor = vec3(0, 0, 0);
        vec3 specularColor = vec3(0, 0, 0);
        float diffuseFactor = max(dot(fragmentNormal, fragmentLightDirection), 0.0);

        if (diffuseFactor > 0.0) {
            diffuseColor = diffuseFactor * uSunlightColor * baseColorDay;

            vec3  fragmentEyeDirection = normalize(-vFragmentPositionEye);
            vec3 fragmentReflectionDirection = reflect(-fragmentLightDirection, fragmentNormal);
            float specularFactor = pow(max(dot(fragmentReflectionDirection, fragmentEyeDirection), 0.0), shininess);
            specularColor = specularFactor * specularStrength * uSunlightColor * texture2D(uSpecularTexture, vFragmentTextureCoordinate).rgb;
        }

        // Ambient lighting
        vec3 baseColorNight = texture2D(uNightTexture, vFragmentTextureCoordinate).rgb +  cloudStrengthNight * baseColorCloud;
        vec3 ambientColor = (ambientStrength - min(2.0 * diffuseFactor, ambientStrength)) * baseColorNight;

        gl_FragColor = vec4(diffuseColor + specularColor + ambientColor, 1);
    }
    else {
        gl_FragColor = vec4(baseColorDay, 1);
    }
}
