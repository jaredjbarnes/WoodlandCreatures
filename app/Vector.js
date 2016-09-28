(function () {

    Vector = function (x, y) {
        if (typeof x !== "number" && typeof y !== "number") {
            throw new Error("Both x and y need to be a number.");
        }
        this.x = x;
        this.y = y;
    };

    Vector.add = function (vectorA, vectorB) {
        return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    };

    Vector.subtract = function (vectorA, vectorB) {
        return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    };

    Vector.multiply = function (vectorA, vectorB) {
        return new Vector(vectorA.x * vectorB.x, vectorA.y * vectorB.y);
    };

    Vector.divide = function (vectorA, vectorB) {
        return new Vector(vectorA.x / vectorB.x, vectorA.y / vectorB.y);
    };

    Vector.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    Vector.prototype.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        return {
            x: this.x * cos - this.y * sin,
            y: this.x * sin + this.y * cos
        };
    };

    Vector.prototype.clone = function () {
        var clone = new Vector(this.x, this.y);
        return clone;
    };

    Vector.prototype.dot = function (vector) {
        return (this.x * vector.x) + (this.y * vector.y);
    };

    Vector.prototype.scale = function (scale) {
        this.x = scale * this.x;
        this.y = scale * this.y;
        return this;
    };

    //Optional vector is for more effecient memory usage.
    Vector.prototype.projectOnVector = function (vector, optionalVector) {
        var scale = this.dot(vector) / vector.dot(vector);
        var output;
        if (optionalVector) {
            output = optionalVector;
            optionalVector.x = vector.x;
            optionalVector.y = vectory.y;
        } else {
            output = vector.clone();
        }

        return output.scale(scale);
    };

    Vector.prototype.multiply = function (vector) {
        this.x = this.x * vector.x;
        this.y = this.y * vector.y;
        return this;
    };

    Vector.prototype.divide = function (vector) {
        this.x = this.x / vector.x;
        this.y = this.y / vector.y;
        return this;
    };

    Vector.prototype.substract = function (vector) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
        return this;
    };

    Vector.prototype.add = function (vector) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
        return this;
    };

    Vector.prototype.getAngle = function (vector) {
        return Math.atan2(vector.y - this.y, vector.x - this.x);
    };

    Vector.prototype.getNormal = function () {
        return new Vector(this.y, -this.x);
    };

    Vector.prototype.normalize = function () {
        var magnitude = this.magnitude();
        if (magnitude === 0) {
            return { x: 0, y: 0 };
        }
        return {
            x: this.x / magnitude,
            y: this.y / magnitude
        }
    };

    app.Vector = Vector;

}());