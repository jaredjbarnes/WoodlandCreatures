BASE.require([
], function () {

    BASE.namespace("app.components");

    app.systems.PlayerCollisionSystem = function () {
        this["@class"] = "app.systems.PlayerCollisionSystem";
        this.entities = [];
        this.isReady = true;
    };

    app.systems.PlayerCollisionSystem.prototype.update = function () {
        var self = this;
        this.entities.forEach(function (entity) {
            self.updateEntity(entity);
        });
    };

    app.systems.PlayerCollisionSystem.prototype.activated = function (game) {
        var self = this;
        game.stage.filter(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.systems.PlayerCollisionSystem.prototype.deactivated = function () {
    };

    app.systems.PlayerCollisionSystem.prototype.entityAdded = function (entity) {
        if (entity.type === "player") {
            this.entities.push(entity);
        }
    };

    app.systems.PlayerCollisionSystem.prototype.entityRemoved = function (entity) {
        if (entity.type === "player") {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.PlayerCollisionSystem.prototype.updateEntity = function (entity) {
        var x;
        var size;
        var position;
        var rectangleBody;
        var movement;
        var otherSize;
        var otherPosition;
        var otherRectangleBody;
        var activeCollisions = entity.getProperty("rigid-body").activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        });
        var length = collisions.length;

        var size = entity.getProperty("size");
        var position = entity.getProperty("position");

        for (x = 0 ; x < length ; x++) {
            collision = collisions[x];

            if (collision.endTimestamp == null) {
                position.x = position.x + Math.round(collision.penetration.x);
                position.y = position.y + Math.round(collision.penetration.y);
            }
        }

    };

});