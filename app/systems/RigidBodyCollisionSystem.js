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
        this.rectA = {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        };
        this.rectB = {
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
        };
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
        this.maxVertex = {
            x: 0,
            y: 0
        };
    };

    app.systems.RigidBodyCollisionSystem.prototype.addCollisionToRigidBody = function (rigidBody, collision) {

    };

    app.systems.RigidBodyCollisionSystem.prototype.prepareRigidBody = function (entity) {
        var rigidBody = entity.getProperty("rigid-body");
        var points = rigidBody.points;
        var length = points.length;

        if (points.length === rigidBody.vertices.length && points.length === rigidBody.normals.length) {
            return;
        }

        rigidBody.vertices = points.map(function (point, index) {
            if (index === 0) {
                return {
                    x: point.x,
                    y: point.y
                };
            } else {
                var lastPoint = points[index - 1];
                return {
                    x: point.x - lastPoint.x,
                    y: point.y - lastPoint.y
                };
            }
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

    app.systems.RigidBodyCollisionSystem.prototype.getRect = function (entity, rect) {
        var position = entity.getProperty("position");
        var rigidBody = entity.getProperty("rigid-body");
        var vertices = ridigBody.vertices;
        var length = vertices.length;

        rect.left = vertices[0].x + position.x;
        rect.right = rect.left;
        rect.top = vertices[0].y + position.y;
        rect.bottom = rect.top;

        for (var x = 0 ; x < length; x++) {
            rect.left = Math.min(rect.left, vertices[x].x + position.x);
            rect.right = Math.max(rect.right, vertices[x].x + position.x);
            rect.top = Math.min(rect.top, vertices[x].y + position.y);
            rect.bottom = Math.max(rect.bottom, vertices[x].y + position.y);
        }

        return rect;
    };

    app.systems.RigidBodyCollisionSystem.prototype.intersects = function (entityA, entityB) {
        var top;
        var left;
        var bottom;
        var right;
        var normal;
        var x;
        var rectA = this.rectA;
        var rectB = this.rectB;
        var joiningVector = this.joiningVector;
        var joiningProjection = this.joiningProjection;
        var projection = this.projection;
        var positionA = entityA.getProperty("position");
        var positionB = entityB.getProperty("position");
        var rigidBodyA = entity.getProperty("rigid-Body");
        var rigidBodyB = entity.getProperty("rigid-Body");
        var verticesA = rigidBodyA.vertices;
        var verticesB = rigidBodyB.vertices;
        var normalsA = rigidBodyA.normals;
        var normalsB = rigidBodyB.normals;
        var lengthA = normalsA.length;
        var lengthB = normalsB.length;
        var maxVertex = this.maxVertex;
        var vx;
        var vertex;

        this.getRect(entityA, rectA);
        this.getRect(entityB, rectB);

        top = Math.min(rectA.top, rectB.top);
        left = Math.min(rectA.left, rectB.left);
        right = Math.max(rectA.right, rectB.right);
        bottom = Math.max(rectA.bottom, rectB.bottom);

        joiningVector.x = right - left;
        joiningVector.y = bottom - top;

        // Iterate through entityA's normals and project.
        for (x = 0 ; x < lengthA; x++) {
            normal = normalsA[x];
            maxVertex.x = 0;
            maxVertex.y = 0;

            Vector.project(joiningVector, normal, joiningProjection);

            for (vx = 0 ; vx < lengthA; vx++) {
                vertex = verticesA[vx];
                Vector.project(vertex, normal, projection);
                maxVertex.x = Math.max(projection.x, maxVertex.x);
                maxVertex.y = Math.max(projection.y, maxVertex.y);
            }

            // If the first polygon projection covers it all then there isn't a need to check the other as well.
            if (Vector.magnitude(maxVertex) > Vector.magnitude(joiningVector)) {
                continue;
            }

            for (vx = 0 ; vx < lengthB; vx++) {
                vertex = verticesB[vx];
                Vector.project(vertex, normal, projection);
                maxVertex.x = Math.max(projection.x, maxVertex.x);
                maxVertex.y = Math.max(projection.y, maxVertex.y);
            }

            if (Vector.magnitude(maxVertex) < Vector.magnitude(joiningVector)) {
                return false;
            }
        }

        // Iterate through entityB's normals and project.
        for (x = 0 ; x < lengthB; x++) {
            normal = normalsB[x];
            maxVertex.x = 0;
            maxVertex.y = 0;

            Vector.project(joiningVector, normal, joiningProjection);

            for (vx = 0 ; vx < lengthA; vx++) {
                vertex = verticesA[vx];
                Vector.project(vertex, normal, projection);
                maxVertex.x = Math.max(projection.x, maxVertex.x);
                maxVertex.y = Math.max(projection.y, maxVertex.y);
            }

            // If the first polygon projection covers it all then there isn't a need to check the other as well.
            if (Vector.magnitude(maxVertex) > Vector.magnitude(joiningVector)) {
                continue;
            }

            for (vx = 0 ; vx < lengthB; vx++) {
                vertex = verticesB[vx];
                Vector.project(vertex, normal, projection);
                maxVertex.x = Math.max(projection.x, maxVertex.x);
                maxVertex.y = Math.max(projection.y, maxVertex.y);
            }

            if (Vector.magnitude(maxVertex) < Vector.magnitude(joiningVector)) {
                return false;
            }
        }

        return true;
    };

    app.systems.RigidBodyCollisionSystem.prototype.handleCollisions = function (entity) {
        var collision;
        var otherEntity;
        var activeCollisions = entity.getProperty("collision").activeCollisions;
        var length = activeCollisions.length;
        var movement = entity.getProperty("movement");
        var position = entity.getProperty("position");

        for (var x = 0 ; x < length; x++) {
            collision = activeCollisions[x];
            otherEntity = collision.entity;

            if (this.intersects(entity, otherEntity)) {
                position.y = movement.previousPosition.y;
                position.x = movement.previousPosition.x;
                movement.position.y = position.y;
                movement.position.x = position.x;
                break;
            }
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.activated = function (game) {
        var self = this;

        this.game = game;
        this.games.stage.filter(function (entity) {
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
        if (entity.hasProperties(["collision", "rigid-body", "movement", "position"])) {
            this.prepareRigidBody(entity);
            this.entities.push(entity);
        }
    };

    app.systems.RigidBodyCollisionSystem.prototype.entityRemoved = function () {
        if (entity.hasProperties(["collision", "rigid-body", "movement", "position"])) {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

});