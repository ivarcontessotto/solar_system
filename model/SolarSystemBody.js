"use strict";

function SolarSystemBody(radius, rotationSpeed, parentBody, relPositionFromParent, orbitalSpeed) {
    this.parentBody = parentBody;
    this.roationSpeed = rotationSpeed;
    // todo rotation axis
    this.orbitalSpeed = orbitalSpeed;
    this.position = calculatePosition(this.parentBody, relPositionFromParent);
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
    // todo calculate translation vector from current pos to origin and back
    // todo perform translation rotation translation
};

SolarSystemBody.prototype.orbit = function (seconds) {
    const angle;
    const axis;
    this.modelMatrix = mat4.multiply(mat4.create(), mat4.fromRotation(mat4.create(), angle, axis), this.modelMatrix);
};

// todo use this for orbit
TextureSphere.prototype.rotateInOrigin = function(angle, axis) {
    // Calculate the translation vectors from the current position to origin and back.
    const translationFromOrigin4 = vec4.create();
    const origin = vec4.fromValues(0, 0, 0, 1);
    vec4.transformMat4(translationFromOrigin4, origin, this.modelMatrix);
    const translationFromOrigin3 = [
        translationFromOrigin4[0] / translationFromOrigin4[3],
        translationFromOrigin4[1] / translationFromOrigin4[3],
        translationFromOrigin4[2] / translationFromOrigin4[3],
    ];
    const translationToOrigin3 = [
        translationFromOrigin3[0] * (-1),
        translationFromOrigin3[1] * (-1),
        translationFromOrigin3[2] * (-1)
    ];

    // Perform rotation in origin
    this.modelMatrix =
        mat4Translate(translationToOrigin3,
            mat4Rotate(angle, axis,
                mat4Translate(translationFromOrigin3,
                    this.modelMatrix)
        )
    )
};

// todo use those
// function mat4TranslatePreMultiply(matrix, translationVector) {
//     return matrix.multiply(matrix.create(), matrix.fromTranslation(matrix.create(), translationVector), matrix);
// }
//
// function mat4RotatePreMultiply(matrix, angleRadians, axisVector) {
//     return mat4.multiply(mat4.create(), mat4.fromRotation(mat4.create(), angleRadians, axisVector), matrix);
// }