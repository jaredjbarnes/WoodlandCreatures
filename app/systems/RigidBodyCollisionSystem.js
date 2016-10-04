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

        this.projectionA = {
            min: 0,
            max: 0
        };

        this.projectionB = {
            min: 0,
            max: 0
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

        rigidBody.worldPoints = points.map(function (point) {
            return {
                x: point.x,
                y: point.y
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
            rigidBody.points.push(rigidBody.points[0]);

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

    app.systems.RigidBodyCollisionSystem.prototype.projectToAxis = function (vertices, axis, projection) {
        var min = Vector.dot(vertices[0], axis);
        var max = min;
        var dot;

        for (var i = 1; i < vertices.length; i += 1) {
            dot = Vector.dot(vertices[i], axis);

            if (dot > max) {
                max = dot;
            } else if (dot < min) {
                min = dot;
            }
        }

        projection.min = min;
        projection.max = max;
    };

    app.systems.RigidBodyCollisionSystem.prototype.overlapAxes = function (verticesA, verticesB, axes) {
        var projectionA = this.projectionA;
        var projectionB = this.projectionB;
        var result = { overlap: Number.MAX_VALUE };
        var overlap;
        var axis;

        projectionA.min = 0;
        projectionA.max = 0;
        projectionB.min = 0;
        projectionB.max = 0;

        for (var i = 0; i < axes.length; i++) {
            axis = axes[i];

            this.projectToAxis(verticesA, axis, projectionA);
            this.projectToAxis(verticesB, axis, projectionB);

            overlap = Math.min(projectionA.max - projectionB.min, projectionB.max - projectionA.min);

            if (overlap <= 0) {
                result.overlap = overlap;
                return result;
            }

            if (overlap < result.overlap) {
                result.overlap = overlap;
                result.axis = axis;
                result.axisNumber = i;
            }
        }

        return result;
    };

    app.systems.RigidBodyCollisionSystem.prototype.updateWorldPoints = function (entity) {
        var rigidBody = entity.getProperty("rigid-body");
        var position = entity.getProperty("position");
        var worldPoints = rigidBody.worldPoints;

        rigidBody.points.forEach(function (point, index) {
            var worldPoint = worldPoints[index];

            worldPoint.x = point.x + position.x + rigidBody.offset.x;
            worldPoint.y = point.y + position.y + rigidBody.offset.y;
        });

    };

    app.systems.RigidBodyCollisionSystem.prototype.intersects = function (entityA, entityB) {
        var x;
        var vx;
        var normal;

        this.updateWorldPoints(entityA);
        this.updateWorldPoints(entityB);

        var rigidBodyA = entityA.getProperty("rigid-body");
        var rigidBodyB = entityB.getProperty("rigid-body");
        var normalsA = rigidBodyA.normals;
        var normalsB = rigidBodyB.normals;
        var projectionA = this.projectionA;
        var projectionB = this.projectionB;
        var verticesA = rigidBodyA.worldPoints;
        var verticesB = rigidBodyB.worldPoints;

        var overlapA = this.overlapAxes(verticesA, verticesB, normalsA);

        if (overlapA.overlap <= 0) {
            return false;
        }

        var overlapB = this.overlapAxes(verticesA, verticesB, normalsB);

        if (overlapB.overlap <= 0) {
            return false;
        }

        return true;
    };

    app.systems.RigidBodyCollisionSystem.prototype.handleCollisions = function (entity) {
        var collision;
        var otherEntity;
        var activeCollisions = entity.getProperty("collision").activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        }).filter(function (collision) {
            return collision.endTimestamp == null;
        });
        var length = collisions.length;

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