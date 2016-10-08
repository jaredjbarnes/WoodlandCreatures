BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collision = app.properties.Collidable;

    var emptyFn = function () { };

    app.systems.BroadphaseCollisionDrawerSystem = function (canvas, camera) {
        var self = this;

        this.isReady = true;
        this.game = null;
        this.canvas = canvas;
        this.camera = camera;
        this.context = canvas.getContext("2d");
        this.entities = [];

        var cameraPosition = this.cameraPosition = camera.getProperty("position");
    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.activated = function (game) {
        var self = this;
        this.game = game;
        game.stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });
    };


    app.systems.BroadphaseCollisionDrawerSystem.prototype.drawJoiningVector = function (entityA, entityB) {
        var context = this.context;
        var offset = this.cameraPosition;

        var positionA = entityA.getProperty("position");
        var sizeA = entityA.getProperty("size");

        var positionB = entityB.getProperty("position");
        var sizeB = entityB.getProperty("size");

        context.beginPath();
        context.lineWidth = 1;
        context.lineCap = "round";
        context.strokeStyle = '#0094ff';

        context.moveTo(positionA.x - offset.x + (sizeA.width / 2), positionA.y - offset.y + (sizeA.height / 2));
        context.lineTo(positionB.x - offset.x + (sizeB.width / 2), positionB.y - offset.y + (sizeB.height / 2));

        context.stroke();
    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.drawEntity = function (entity) {
        var context = this.context;
        var offset = this.cameraPosition;

        var position = entity.getProperty("position");
        var size = entity.getProperty("size");

        context.beginPath();
        context.strokeStyle = '#99ff00';
        context.rect(position.x, position.y, size.width, size.height);
        context.stroke();

    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.update = function () {
        var self = this;
        this.entities.forEach(function (entity) {
            var collision = entity.getProperty("collidable");
            var activeCollisions = collision.activeCollisions;

            var collisions = Object.keys(activeCollisions).map(function (key) {
                return activeCollisions[key];
            });

            if (collisions.length > 0 && entity.type !== "camera") {
                self.drawEntity(entity);

                collisions.forEach(function (collision) {
                    if (collision.entity.type !== "camera") {
                        self.drawEntity(collision.entity);
                        self.drawJoiningVector(entity, collision.entity);
                    }
                });
            }
        });
    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["position", "size", "collidable"])) {
            this.entities.push(entity);
        }
    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.entityRemoved = function (entity) {
        if (entity.hasProperties(["position", "size", "collidable"])) {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.BroadphaseCollisionDrawerSystem.prototype.deactivated = function () {

    };

});