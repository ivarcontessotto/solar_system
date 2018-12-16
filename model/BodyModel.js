"use strict";

function BodyModel(radius, rotationSpeed, rotationAxis, parentBody, relPositionFromParent, orbitalSpeed, orbitalAxis) {

    const calculateInitialPosition = () => {
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
    this.position = calculateInitialPosition();
    this.orbitalSpeed = orbitalSpeed;
    this.orbitalAxis = orbitalAxis;
    this.lastOrbitAngle = 0;
    this.modelMatrix = createModelMatrix();
}

BodyModel.prototype.rotateAroundOwnAxis = function(seconds) {
    const angle = this.roationSpeed * seconds;
    if (angle <= 0) {
        return;
    }

    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, vec3MultiplyScalar(this.position, -1));
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, angle, this.rotationAxis);
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, this.position);
};

BodyModel.prototype.orbit = function (seconds) {
    if (this.parentBody === null) {
        return;
    }

    this.lastOrbitAngle = this.orbitalSpeed * seconds;
    if (this.lastOrbitAngle <= 0) {
        return;
    }

    // first rotate around origin same as parent to catch up
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, this.parentBody.lastOrbitAngle, this.parentBody.orbitalAxis);
    // orbit around parent
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, vec3MultiplyScalar(this.parentBody.position, -1));
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, this.lastOrbitAngle, this.orbitalAxis);
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, this.parentBody.position);
    // update position vector
    this.position = vec3CartesianFromHomogeneous(vec4MultiplyMat4([0, 0, 0, 1], this.modelMatrix));
};