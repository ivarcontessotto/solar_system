"use strict";

function BodySurfaceAttribute(diffuseMap, specularMap, ambientMap, phongStrength, cloudMap, cloudStrength) {
    this.diffuseMap = diffuseMap;
    this.specularMap = specularMap;
    this.ambientMap = ambientMap;
    this.phongStrength = phongStrength;
    this.cloudMap = cloudMap;
    this.cloudStrength = cloudStrength;
}