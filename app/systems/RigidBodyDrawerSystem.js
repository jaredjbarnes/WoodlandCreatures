BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.Movement"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collision = app.properties.Collidable;
    var Movement = app.properties.Movement;

    var emptyFn = function () { };

    app.systems.RigidBodyDrawerSystem = function (canvas, camera) {
        var self = this;

        this.isReady = true;
        this.game = null;
        this.canvas = canvas;
        this.camera = camera;
        this.context = canvas.getContext("2d");
        this.entities = [];

        var cameraPosition = this.cameraPosition = camera.getProperty("position");
    };

    app.systems.RigidBodyDrawerSystem.prototype.activated = function (game) {
        var self = this;
        this.game = game;
        game.stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });
    };


    app.systems.RigidBodyDrawerSystem.prototype.drawJoiningVector = function (entityA, entityB) {
        var context = this.context;
        var offset = this.cameraPosition;

        var positionA = entityA.getProperty("position");
        var rigidBodyA = entityA.getProperty("rigid-body");

        var positionB = entityB.getProperty("position");
        var rigidBodyB = entityB.getProperty("rigid-body");

        context.beginPath();
        context.lineWidth = 1;
        context.lineCap = "round";
        context.strokeStyle = '#000000';

        context.moveTo(positionA.x - offset.x + rigidBodyA.origin.x, positionA.y + rigidBodyA.origin.y - offset.y);
        context.lineTo(positionB.x - offset.x + rigidBodyB.origin.x, positionB.y + rigidBodyB.origin.y - offset.y);

        context.stroke();
    };

    app.systems.RigidBodyDrawerSystem.prototype.drawRigidBody = function (entity) {
        var context = this.context;
        var offset = this.cameraPosition;

        var position = entity.getProperty("position");
        var rigidBody = entity.getProperty("rigid-body");

        context.beginPath();
        context.lineWidth = 1;
        context.lineCap = "round";
        context.strokeStyle = '#99ff00';

        rigidBody.points.forEach(function (point) {
            context.lineTo(position.x - offset.x + point.x, position.y + point.y - offset.y);
        });

        context.lineTo(position.x - offset.x + rigidBody.points[0].x, position.y + rigidBody.points[0].y - offset.y);

        context.stroke();

    };

    app.systems.RigidBodyDrawerSystem.prototype.update = function () {
        var self = this;
        this.entities.forEach(function (entity) {
            var collision = entity.getProperty("collidable");
            var rigidBody = entity.getProperty("rigid-body");
            var activeCollisions = collision.activeCollisions;

            var collisions = Object.keys(activeCollisions).map(function (key) {
                return activeCollisions[key];
            }).filter(function (collision) {
                return collision.entity.hasProperties(["rigid-body"]) && collision.endTimestamp == null;
            });

            if (collisions.length > 0) {
                self.drawRigidBody(entity);

                collisions.forEach(function (collision) {
                    self.drawRigidBody(collision.entity);

                    self.drawJoiningVector(entity, collision.entity);
                });
            }
        });
    };

    app.systems.RigidBodyDrawerSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["collidable", "rigid-body"])) {
            this.entities.push(entity);
        }
    };

    app.systems.RigidBodyDrawerSystem.prototype.entityRemoved = function () {
        if (entity.hasProperties(["collidable", "rigid-body"])) {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.RigidBodyDrawerSystem.prototype.deactivated = function () {

    };

});