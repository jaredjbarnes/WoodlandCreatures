BASE.require([], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var isRestrainable = function (entity) {
        var restraint = entity.properties["restraint"];
        var transform = entity.properties["transform"];

        return restraint && restraint[0] && transform && transform[0];
    };

    app.systems.RestraintSystem = function (canvas) {
        this.isReady = true;
        this.game = null;
        this.entities = [];
        this.restrainedEntities = [];
    };

    app.systems.RestraintSystem.prototype.entityAdded = function (entity) {
        var restraint;
        var transformEntity;

        this.entities.push(entity);

        if (isRestrainable(entity)) {
            this.restrainedEntities.push(entity);

            restraint = entity.properties["restraint"][0];

            if (restraint.transform != null) {
                return;
            }

            transformEntity = this.entities.filter(function (entity) {
                return entity.id === restraint.byEntityId;
            })[0];

            if (transformEntity && transformEntity.properties["transform"] && transformEntity.properties["transform"][0]) {
                restraint.transform = transformEntity.properties["transform"][0];
            }
        }
    };

    app.systems.RestraintSystem.prototype.entityRemoved = function (entity) {
        var index = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
        }

        if (isRestrainable(entity)) {
            var index = this.restrainedEntities.indexOf(entity);

            if (index > -1) {
                this.restrainedEntities.splice(index, 1);
            }
        }
    };

    app.systems.RestraintSystem.prototype.activated = function (game) {
        this.game = game;
        var entities = game.rootEntity.filter();

        for (var x = 0 ; x < entities.length; x++) {
            this.entityAdded(entities[x]);
        }
    };

    app.systems.RestraintSystem.prototype.update = function () {
        var entities = this.restrainedEntities;
        var length = entities.length;
        var entity;
        var restraint;
        var transform;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            restraint = entity.properties["restraint"][0];
            transform = entity.properties["transform"][0];

            if (restraint == null || transform == null) {
                return;
            }

            if (transform.x < restraint.transform.x) {
                transform.x = restraint.transform.x;
            }

            if (transform.y < restraint.transform.y) {
                transform.y = restraint.transform.y
            }

            if (transform.x + transform.width > restraint.transform.x + restraint.transform.width) {
                transform.x = restraint.transform.x + restraint.transform.width - transform.width;
            }

            if (transform.y + transform.height > restraint.transform.y + restraint.transform.height) {
                transform.y = restraint.transform.y + restraint.transform.height - transform.height;
            }
        }
    };

    app.systems.RestraintSystem.prototype.deactivated = function () {

    };


});