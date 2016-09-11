BASE.require([], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var isMovable = function (entity) {
        return entity.hasProperties(["movement", "position"]);
    };

    app.systems.MovementSystem = function (canvas) {
        this.isReady = true;
        this.game = null;
        this.entities = [];
    };

    app.systems.MovementSystem.prototype.entityAdded = function (entity) {
        var movement;
        var transformEntity;

        if (isMovable(entity)) {
            this.entities.push(entity);
            movement = entity.getProperty("movement");
        }
    };

    app.systems.MovementSystem.prototype.entityRemoved = function (entity) {
        if (isMovable(entity)) {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.MovementSystem.prototype.activated = function (game) {
        this.game = game;
        var entities = game.rootEntity.filter();

        for (var x = 0 ; x < entities.length; x++) {
            this.entityAdded(entities[x]);
        }
    };

    app.systems.MovementSystem.prototype.update = function () {
        var entities = this.entities;
        var length = entities.length;
        var entity;
        var movement;
        var transform;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            movement = entity.getProperty("movement");
            position = entity.getProperty("position");

            if (movement == null || position == null) {
                return;
            }

            movement.previousPosition.x = position.x;
            movement.previousPosition.y = position.y;

            position.x = movement.position.x;
            position.y = movement.position.y;

        }
    };

    app.systems.MovementSystem.prototype.deactivated = function () {

    };


});