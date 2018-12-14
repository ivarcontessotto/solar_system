"use strict";

function SolarSystemBody(radius, rotationSpeed, rotationAxis, parentBody, relPositionFromParent, orbitalSpeed, orbitalAxis) {
    this.roationSpeed = rotationSpeed;
    this.rotationAxis = rotationSpeed;
    this.parentBody = parentBody;
    this.position = calculatePosition(this.parentBody, relPositionFromParent);
    this.orbitalSpeed = orbitalSpeed;
    this.orbitalAxis = orbitalAxis;
    this.modelMatrix = createModelMatrix(radius, this.position);

    function calculatePosition(parentBody, relPositionFromParent) {
        if (parentBody != null) {
            return vec3.add(vec3.create(), parentBody.position, relPositionFromParent);
        }
        else {
            // If there is no parent body, the position is the origin.
            return vec3.create();
        }
    }

    function createModelMatrix(radius, position) {
        return mat4.multiply(mat4.create(),
            mat4.fromTranslation(mat4.create(), position),
            mat4.fromScaling(mat4.create(), [radius, radius, radius]));
    }
}

SolarSystemBody.prototype.rotateAroundOwnAxis = function(seconds) {
    const angle = this.roationSpeed * seconds;
    if (angle <= 0) {
        return;
    }

    // Calculate the translation vectors from the current position to origin and back.
    const origin = vec4.fromValues(0, 0, 0, 1);
    const translationFromOrigin4 = vec4MultiplyMat4(origin, this.modelMatrix);
    const translationFromOrigin3 = vec3CartesianFromHomogeneous(translationFromOrigin4);
    const translationToOrigin3 = vec3MultiplyScalar(translationFromOrigin3, -1);

    // Perform rotation in origin
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, translationToOrigin3);
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, angle, this.rotationAxis);
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, translationFromOrigin3);
};

SolarSystemBody.prototype.orbit = function (seconds) {
    // todo orbital axis needs to be updated to be updated according to parent position!
    const angle = this.orbitalSpeed * seconds;
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, angle, this.orbitalAxis);
};