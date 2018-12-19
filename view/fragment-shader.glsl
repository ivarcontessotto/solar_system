precision mediump float;

varying vec2 vFragmentTextureCoordinate;
uniform sampler2D uDiffuseMap;
uniform sampler2D uSpecularMap;
uniform sampler2D uAmbientMap;
uniform sampler2D uCloudMap;

uniform vec4 uPhongStrength;
uniform vec2 uCloudStrength;

uniform vec3 uSunlightColor;
uniform vec3 uSunPositionEye;
varying vec3 vFragmentPositionEye;
varying vec3 vFragmentNormalEye;

uniform bool uRenderShadowmap;

void main() {

    // todo move to shadowmapping shader
    if(uRenderShadowmap) {
        return;
    }

    vec3 baseCloudColor = texture2D(uCloudMap, vFragmentTextureCoordinate).rgb;
    vec3 baseDiffuseColor = texture2D(uDiffuseMap, vFragmentTextureCoordinate).rgb + uCloudStrength[0] * baseCloudColor;

    vec3 fragmentLightDirection = normalize(uSunPositionEye - vFragmentPositionEye);
    vec3 fragmentNormal = normalize(vFragmentNormalEye);

    // Diffuse Lighting, Specular Lighting
    float diffuseFactor = max(dot(fragmentNormal, fragmentLightDirection), 0.0);
    vec3 diffuseColor = vec3(0, 0, 0);
    vec3 specularColor = vec3(0, 0, 0);

    if (diffuseFactor > 0.0) {
        diffuseColor = diffuseFactor * uPhongStrength[0] * uSunlightColor * baseDiffuseColor;

        vec3  fragmentEyeDirection = normalize(-vFragmentPositionEye);
        vec3 fragmentReflectionDirection = reflect(-fragmentLightDirection, fragmentNormal);
        float specularFactor = pow(max(dot(fragmentReflectionDirection, fragmentEyeDirection), 0.0), uPhongStrength[2]);
        specularColor = specularFactor * uPhongStrength[1] * uSunlightColor * texture2D(uSpecularMap, vFragmentTextureCoordinate).rgb;
    }

    // Ambient lighting
    vec3 baseAmbientColor = texture2D(uAmbientMap, vFragmentTextureCoordinate).rgb +  uCloudStrength[1] * baseCloudColor;
    vec3 ambientColor = (uPhongStrength[3] - min(diffuseFactor, uPhongStrength[3])) * baseAmbientColor;

    gl_FragColor = vec4(diffuseColor + specularColor + ambientColor, 1);
}