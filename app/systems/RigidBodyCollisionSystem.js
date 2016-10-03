BASE.require([
    "app.Entity",
    "app.Vector"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Vector = app.Vector;

    app.systems.RigidBodyCollisionSystem = function () {
        this.isReady = true;
        this.entities = [];

        // We reuse these objects to prevent heavy garbage collection.
        this.joiningVector = {
            x: 0,
            y: 0
        };

        this.joiningProjection = {
            x: 0,
            y: 0
        };

        this.projection = {
            x: 0,
            y: 0
        };

        this.maxA = {
            x: 0,
            y: 0
        };

        this.maxB = {
            x: 0,
            y: 0
        };

        this.minA = {
            x: 0,
            y: 0
        };

        this.minB = {
            x: 0,
            y: 0
        };

    };

    app.systems.RigidBodyCollisionSystem.prototype.prepareRigidBody = function (rigidBody) {
        var points = rigidBody.points;
        var length = points.length;

        if (points.length === rigidBody.vertices.length &&
            points.length === rigidBody.normals.length &&
            points.length === rigidBody.projectionVertices.length) {
            return;
        }

        this.setSize(rigidBody);

        rigidBody.vertices = points.map(function (point, index) {
            var nextPoint = points[index + 1] || points[0];
            return {
                x: point.x - nextPoint.x,
                y: point.y - nextPoint.y
            };
        });

        rigidBody.projectionVertices = points.map(function (point) {
            return {
                x: point.x - rigidBody.origin.x,
                y: point.y - rigidBody.origin.y
            };
        });

        rigidBody.normals = rigidBody.vertices.map(function (vertex, index) {
            return Vector.getLeftNormal(vertex);
        });

        var finalVector = rigidBody.vertices.reduce(function (accumulator, vertex) {
            accumulator.x += vertex.x;
            accumulator.y += vertex.y;

            return accumulator;
        }, { x: 0, y: 0 });

        // If the final vector isn't (0,0) then make it so, to finish the polygon.
        if (finalVector.x !== 0 || finalVector.y !== 0) {
            rigidBody.points.push({
                x: 0,
                y: 0
            });

            rigidBody.vertices.push({
                x: -finalVector.x,
                y: -finalVector.y
            });

            normals.push(Vector.getLeftNormal(rigidBody.vertices[rigidBody.vertices.length - 1]));
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.setSize = function (rigidBody) {
        var width;
        var height;
        var points = rigidBody.points;
        var offset = rigidBody.offset;
        var length = points.length;

        var top = points[0].y;
        var left = points[0].x;
        var bottom = points[0].y;
        var right = points[0].x;

        for (var x = 1 ; x < length; x++) {
            top = Math.min(top, points[x].y);
            left = Math.min(left, points[x].x);
            bottom = Math.max(bottom, points[x].y);
            right = Math.max(right, points[x].x);
        }

        width = right - left;
        height = bottom - top;

        rigidBody.size.width = width;
        rigidBody.size.height = height;

        rigidBody.origin.x = width / 2;
        rigidBody.origin.y = height / 2;
    };

    app.systems.RigidBodyCollisionSystem.prototype.setJoiningVector = function (entityA, entityB) {
        var positionA = entityA.getProperty("position");
        var positionB = entityB.getProperty("position");

        var rigidBodyA = entityA.getProperty("rigid-body");
        var rigidBodyB = entityB.getProperty("rigid-body");

        var entityAOriginY = positionA.y + rigidBodyA.offset.y + rigidBodyA.origin.y;
        var entityBOriginY = positionB.y + rigidBodyB.offset.y + rigidBodyB.origin.y;

        var entityAOriginX = positionA.x + rigidBodyA.offset.x + rigidBodyA.origin.x;
        var entityBOriginX = positionB.x + rigidBodyB.offset.x + rigidBodyB.origin.x;

        this.joiningVector.x = entityAOriginX - entityBOriginX;
        this.joiningVector.y = entityAOriginY - entityBOriginY;
    };

    app.systems.RigidBodyCollisionSystem.prototype.intersects = function (entityA, entityB) {
        var x;
        var vx;
        var normal;

        var rigidBodyA = entityA.getProperty("rigid-body");
        var rigidBodyB = entityB.getProperty("rigid-body");

        var projectionVerticesA = rigidBodyA.projectionVertices;
        var projectionVerticesB = rigidBodyB.projectionVertices;
        var normalsA = rigidBodyA.normals;
        var normalsB = rigidBodyB.normals;
        var lengthA = projectionVerticesA.length;
        var lengthB = projectionVerticesB.length;
        var minA = this.minA;
        var minB = this.minB;
        var maxA = this.maxA;
        var maxB = this.maxB;
        var projection = this.projection;
        var joiningProjection = this.joiningProjection;
        var joiningVector = this.joiningVector;
        var joiningMagnitude;


        this.setJoiningVector(entityA, entityB);

        // Loop through all the normals of the first polygon.
        for (x = 0 ; x < lengthA; x++) {
            normal = normalsA[x];

            minA.x = 0;
            minB.y = 0;
            maxA.x = 0;
            maxB.y = 0;

            Vector.project(joiningVector, normal, joiningProjection);
            joiningMagnitude = Vector.magnitude(joiningProjection);

            for (vx = 0 ; vx < lengthA; vx++) {
                Vector.project(rigidBodyA.projectionVertices[vx], normal, projection);

                minA.x = Math.min(minA.x, projection.x);
                minA.y = Math.min(minA.y, projection.y);

                maxA.x = Math.max(maxA.x, projection.x);
                maxA.y = Math.max(maxA.y, projection.y);
            }

            for (vx = 0 ; vx < lengthB; vx++) {
                Vector.project(rigidBodyB.projectionVertices[vx], normal, projection);

                minB.x = Math.min(minB.x, projection.x);
                minB.y = Math.min(minB.y, projection.y);

                maxB.x = Math.max(maxB.y, projection.x);
                maxB.y = Math.max(maxB.y, projection.y);
            }

            var maxAMagnitude = Vector.magnitude(maxA);
            var minAMagnitude = Vector.magnitude(minA);

            var maxBMagnitude = Vector.magnitude(maxB);
            var minBMagnitude = Vector.magnitude(minB);

            if (maxAMagnitude + minBMagnitude < joiningMagnitude || minAMagnitude + maxBMagnitude < joiningMagnitude) {
                return false;
            }

        }


        // Loop through all the normals of the second polygon.
        for (x = 0 ; x < lengthA; x++) {
            normal = normalsB[x];

            minA.x = 0;
            minB.y = 0;
            maxA.x = 0;
            maxB.y = 0;

            Vector.project(joiningVector, normal, joiningProjection);
            joiningMagnitude = Vector.magnitude(joiningProjection);

            for (vx = 0 ; vx < lengthA; vx++) {
                Vector.project(rigidBodyA.projectionVertices[vx], normal, projection);

                minA.x = Math.min(minA.x, projection.x);
                minA.y = Math.min(minA.y, projection.y);

                maxA.x = Math.max(maxA.x, projection.x);
                maxA.y = Math.max(maxA.y, projection.y);
            }

            for (vx = 0 ; vx < lengthB; vx++) {
                Vector.project(rigidBodyB.projectionVertices[vx], normal, projection);

                minB.x = Math.min(minB.x, projection.x);
                minB.y = Math.min(minB.y, projection.y);

                maxB.x = Math.max(maxB.y, projection.x);
                maxB.y = Math.max(maxB.y, projection.y);
            }

            var maxAMagnitude = Vector.magnitude(maxA);
            var minAMagnitude = Vector.magnitude(minA);

            var maxBMagnitude = Vector.magnitude(maxB);
            var minBMagnitude = Vector.magnitude(minB);

            if (maxAMagnitude + minBMagnitude < joiningMagnitude ||
                minAMagnitude + maxBMagnitude < joiningMagnitude) {
                return false;
            }

        }

        return true;
    };

    app.systems.RigidBodyCollisionSystem.prototype.handleCollisions = function (entity) {
        var collision;
        var otherEntity;
        var activeCollisions = entity.getProperty("collision").activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) { return activeCollisions[key]; });
        var length = collisions.length;
        var position = entity.getProperty("position");

        for (var x = 0 ; x < length; x++) {
            collision = collisions[x];
            otherEntity = collision.entity;

            if (!otherEntity.hasProperties(["rigid-body"])) {
                continue;
            }

            if (this.intersects(entity, otherEntity)) {
                break;
            }
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.activated = function (game) {
        var self = this;

        this.game = game;
        this.game.stage.filter(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.systems.RigidBodyCollisionSystem.prototype.update = function () {
        var entity;
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0 ; x < length ; x++) {
            entity = this.entities[x];
            this.handleCollisions(entity);
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.deactivated = function () {

    };

    app.systems.RigidBodyCollisionSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["collision", "rigid-body", "position"])) {
            this.prepareRigidBody(entity.getProperty("rigid-body"));
            this.entities.push(entity);
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.entityRemoved = function () {
        if (entity.hasProperties(["collision", "rigid-body", "position"])) {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

});