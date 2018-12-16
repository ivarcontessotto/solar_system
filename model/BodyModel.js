"use strict";

function BodyModel(radius, rotationSpeed, rotationAxis, parentBody, relPositionFromParent, orbitalSpeed, orbitalAxis) {

    const calculatePosition = () => {
        if (this.parentBody != null) {
            return vec3.add(vec3.create(), this.parentBody.position, relPositionFromParent);
        }
        else {
            // If there is no parent body, the position is the origin.
            return vec3.create();
        }
    };

    const createModelMatrix = () => {
        return mat4Multiply(
            mat4CreateTranslation(this.position),
            mat4CreateScaling([radius, radius, radius]));
    };

    this.roationSpeed = rotationSpeed;
    this.rotationAxis = rotationAxis;
    this.parentBody = parentBody;
    this.position = calculatePosition();
    this.orbitalSpeed = orbitalSpeed;
    this.orbitalAxis = orbitalAxis;
    this.modelMatrix = createModelMatrix();
}

BodyModel.prototype.rotateAroundOwnAxis = function(seconds) {
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

BodyModel.prototype.orbit = function (seconds) {
    // todo orbital axis needs to be updated to be updated according to parent position as soon as we have moons
    const angle = this.orbitalSpeed * seconds;
    if (angle <= 0) {
        return;
    }

    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, angle, this.orbitalAxis);
};