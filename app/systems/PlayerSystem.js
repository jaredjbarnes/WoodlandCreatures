BASE.require([
    "app.components.PlayerState",
    "app.components.Renderable",
    "app.components.Sprite",
    "app.components.Rect"
], function () {
    BASE.namespace("app.systems");

    var PlayerState = app.components.PlayerState;
    var Renderable = app.components.Renderable;
    var Sprite = app.components.Sprite;
    var Rect = app.components.Rect;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var isPlayer = function (entity) {
        return entity.type === "Player" && entity.hasComponentByType(PlayerState) && entity.hasComponentByType(Renderable) && entity.hasComponentByType(Sprite);
    };

    var standingRightState = {
        activated: function (entity) {
            // Change the sprite
        },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var standingLeftState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var standingUpState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var standingDownState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };


    var strikingRightState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var strikingLeftState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var strikingUpState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var strikingDownState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };


    var runningRightState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var runningLeftState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var runningUpState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    var runningDownState = {
        activated: function (entity) { },
        update: function (entity) { },
        deactivated: function (entity) { }
    };

    app.systems.PlayerSystem = function (inputMapping, inputSystem, collisionSystem) {
        this.game = null;
        var timer = this.game.timer;
        this.entities = [];
        this.inputSystem = inputSystem;
        this.collisionsSystem = collisionsSystem;
        this.inputMapping = inputMapping || {
            "37": "left",
            "38": "top",
            "39": "right",
            "40": "bottom"
        };
    };

    app.systems.PlayerSystem.prototype.updatePlayer = function (entity) {
        // Save the current state name.
        // Invoke the current states update.
        // Check if state changed with the invocation.
        //      * If changed
        //          - Invoke the deactivated on old state.
        //          - Invoke the activated on new state.
        //          - Invoke the update on the new state.
    };

    app.systems.PlayerSystem.prototype.update = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.updatePlayer(entities[x]);
        }
    };

    app.systems.PlayerSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isPlayer);
    };

    app.systems.PlayerSystem.prototype.activated = function (game) {
        this.game = game;
        this.cacheEntities();
    };

    app.systems.PlayerSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };


});