"use strict";

function SphereModel(radius, rotationSpeed, rotationAxis, parentModel, relPositionFromParent, orbitalSpeed, orbitalAxis) {

    const calculateInitialPosition = () => {
        if (this.parentBody != null) {
            this.position = vec3.add(vec3.create(), this.parentBody.position, relPositionFromParent);
        }
        else {
            // If there is no parent body, the position is the origin.
            this.position = vec3.create();
        }
    };

    const createModelMatrix = () => {
        this.modelMatrix = mat4Multiply(
            mat4CreateTranslation(this.position),
            mat4CreateScaling([radius, radius, radius]));
    };

    this.roationSpeed = rotationSpeed;
    this.rotationAxis = rotationAxis;
    this.parentBody = parentModel;
    calculateInitialPosition();
    this.orbitalSpeed = orbitalSpeed;
    this.orbitalAxis = orbitalAxis;
    this.lastOrbitAngle = 0;
    createModelMatrix();
}

SphereModel.prototype.rotateAroundOwnAxis = function(seconds) {
    const angle = this.roationSpeed * seconds;
    if (angle <= 0) {
        return;
    }

    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, vec3MultiplyScalar(this.position, -1));
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, angle, this.rotationAxis);
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, this.position);
};

SphereModel.prototype.orbit = function (seconds) {
    if (this.parentBody === null) {
        return;
    }

    this.lastOrbitAngle = this.orbitalSpeed * seconds;
    if (this.lastOrbitAngle <= 0) {
        return;
    }

    // first rotate around origin same as parent to catch UP
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, this.parentBody.lastOrbitAngle, this.parentBody.orbitalAxis);
    // orbit around parent
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, vec3MultiplyScalar(this.parentBody.position, -1));
    this.modelMatrix = mat4RotatePreMul(this.modelMatrix, this.lastOrbitAngle, this.orbitalAxis);
    this.modelMatrix = mat4TranslatePreMul(this.modelMatrix, this.parentBody.position);
    // update position vector
    this.position = vec3HomogeneousToCartesian(vec4MultiplyMat4([0, 0, 0, 1], this.modelMatrix));
};