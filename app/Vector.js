(function () {

    var Vector = function () { };

    Vector.add = function (vectorA, vectorB, optionalVector) {
        optionalVector = optionalVector || {};
        optionalVector.x = vectorA.x + vectorB.x;
        optionalVector.y = vectorA.y + vectorB.y;

        return optionalVector;
    };

    Vector.subtract = function (vectorA, vectorB, optionalVector) {
        optionalVector = optionalVector || {};
        optionalVector.x = vectorA.x - vectorB.x;
        optionalVector.y = vectorA.y - vectorB.y;

        return optionalVector;
    };

    Vector.multiply = function (vectorA, vectorB) {
        optionalVector = optionalVector || {};
        optionalVector.x = vectorA.x * vectorB.x;
        optionalVector.y = vectorA.y * vectorB.y;

        return optionalVector;
    };

    Vector.divide = function (vectorA, vectorB) {
        optionalVector = optionalVector || {};
        optionalVector.x = vectorA.x / vectorB.x;
        optionalVector.y = vectorA.y / vectorB.y;

        return optionalVector;
    };

    Vector.scale = function (vector, scale, optionalVector) {
        optionalVector = optionalVector || {};
        optionalVector.x = scale * vector.x;
        optionalVector.y = scale * vector.y;

        return optionalVector;
    };

    Vector.project = function (vectorA, vectorB, optionalVector) {
        var scale; 
        
        var firstDot = Vector.dot(vectorA, vectorB);
        var secondDot = Vector.dot(vectorB, vectorB);

        if (!firstDot || !secondDot){
            scale = 0;
        } else {
            scale = firstDot / secondDot;
        }
        
        return Vector.scale(vectorB, scale, optionalVector);
    };

    Vector.getLeftNormal = function (vector, optionalVector) {
        optionalVector = optionalVector || {};

        optionalVector.x = -vector.y;
        optionalVector.y = vector.x;

        return optionalVector;
    };

    Vector.getRightNormal = function (vector) {
        optionalVector = optionalVector || {};

        optionalVector.x = vector.y;
        optionalVector.y = -vector.x;

        return optionalVector;
    };

    Vector.magnitude = function (vector) {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    };

    Vector.dot = function (vectorA, vectorB) {
        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    };

    Vector.normalize = function (vector, optionalVector) {
        optionalVector = optionalVector || {};
        var magnitude = Vector.magnitude(vector);

        if (magnitude === 0) {
            optionalVector.x = 0;
            optionalVector.y = 0;
        }

        optionalVector.x = this.x / magnitude;
        optionalVector.y = this.y / magnitude;

        return optionalVector;
    };

    app.Vector = Vector;

}());