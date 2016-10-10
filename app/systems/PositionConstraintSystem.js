BASE.require([], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var isRestrainable = function (entity) {
        return entity.hasProperties(["size", "position", "position-constraint"]);
    };

    app.systems.PositionConstraintSystem = function (canvas) {
        this.isReady = true;
        this.game = null;
        this.entities = [];
        this.constrainedEntities = [];
    };

    app.systems.PositionConstraintSystem.prototype.entityAdded = function (entity) {
        var positionConstraint;
        var constrainToEntity;
        var position;
        var size;

        this.entities.push(entity);

        if (isRestrainable(entity)) {
            this.constrainedEntities.push(entity);

            positionConstraint = entity.getProperty("position-constraint");

            if (positionConstraint.byEntityId == null) {
                return;
            }

            constrainToEntity = this.entities.filter(function (entity) {
                return entity.id === positionConstraint.byEntityId;
            })[0];

            if (constrainToEntity && constrainToEntity.hasProperties(["size", "position"])) {
                position = constrainToEntity.getProperty("position");
                size = constrainToEntity.getProperty("size");

                positionConstraint.position = position;
                positionConstraint.size = size;
            }
        }
    };

    app.systems.PositionConstraintSystem.prototype.entityRemoved = function (entity) {
        var index = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
        }

        if (isRestrainable(entity)) {
            var index = this.constrainedEntities.indexOf(entity);

            if (index > -1) {
                this.constrainedEntities.splice(index, 1);
            }
        }
    };

    app.systems.PositionConstraintSystem.prototype.activated = function (game) {
        this.game = game;
        var entities = game.stage.filter();

        for (var x = 0 ; x < entities.length; x++) {
            this.entityAdded(entities[x]);
        }
    };

    app.systems.PositionConstraintSystem.prototype.update = function () {
        var entities = this.constrainedEntities;
        var length = entities.length;
        var entity;
        var positionConstraint;
        var size;
        var position;
        var movement;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            positionConstraint = entity.getProperty("position-constraint");
            size = entity.getProperty("size");
            position = entity.getProperty("position");

            if (size == null || position == null) {
                return;
            }

            if (position.x + size.width > positionConstraint.position.x + positionConstraint.size.width) {
                position.x = positionConstraint.position.x + positionConstraint.size.width - size.width;
            }

            if (position.y + size.height > positionConstraint.position.y + positionConstraint.size.height) {
                position.y = positionConstraint.position.y + positionConstraint.size.height - size.height;
            }

            if (position.x < positionConstraint.position.x) {
                position.x = positionConstraint.position.x;
            }

            if (position.y < positionConstraint.position.y) {
                position.y = positionConstraint.position.y
            }

        }
    };

    app.systems.PositionConstraintSystem.prototype.deactivated = function () {

    };


});