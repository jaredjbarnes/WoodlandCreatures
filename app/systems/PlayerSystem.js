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

    var isPlayer = function (entity, system) {
        return entity.type === "Player" && entity.hasComponentByType(PlayerState) && entity.hasComponentByType(Renderable) && entity.hasComponentByType(Sprite);
    };

    var handleStateChangeByInput = function (entity, system, nothingState) {
        var inputSystem = system.inputSystem;
        var inputMapping = system.inputMapping;
        var mappingKeys = Object.keys(inputMapping);
        var playerState = entity.getComponentByType(PlayerState);

        var isNothing = mappingKeys.every(function (key) {
            return !inputSystem.pressedKeys[key];
        });

        if (isNothing) {
            playerState.name = nothingState;
        } else {
            mappingKeys.every(function (key) {
                if (inputSystem.pressedKeys[key]) {
                    playerState.name = inputMapping[key];
                    return false;
                }
                return true;
            });
        }
    };


    var standingRightState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 8,
                x: 198
            }];
        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingRightState");
        },
        deactivated: function (entity, system) { }
    };

    var standingLeftState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 9,
                x: 8
            }];
        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingLeftState");
        },
        deactivated: function (entity, system) { }
    };

    var standingUpState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 209,
                x: 95
            }];
        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingUpState");
        },
        deactivated: function (entity, system) { }
    };

    var standingDownState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 211,
                x: 49
            }];
        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingDownState");
        },
        deactivated: function (entity, system) { }
    };


    var strikingRightState = {
        activated: function (entity, system) { },
        update: function (entity, system) { },
        deactivated: function (entity, system) { }
    };

    var strikingLeftState = {
        activated: function (entity, system) { },
        update: function (entity, system) { },
        deactivated: function (entity, system) { }
    };

    var strikingUpState = {
        activated: function (entity, system) { },
        update: function (entity, system) { },
        deactivated: function (entity, system) { }
    };

    var strikingDownState = {
        activated: function (entity, system) { },
        update: function (entity, system) { },
        deactivated: function (entity, system) { }
    };


    var runningRightState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 8,
                x: 198
            }, {
                y: 8,
                x: 219
            }, {
                y: 8,
                x: 244
            }, {
                y: 8,
                x: 267
            }, {
                y: 8,
                x: 291
            }, {
                y: 8,
                x: 315
            }, {
                y: 8,
                x: 336
            }, {
                y: 8,
                x: 357
            }];

        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingRightState");
        },
        deactivated: function (entity, system) { }
    };

    var runningLeftState = {
        activated: function (entity, system) {
            var sprite = entity.getComponentByType(Sprite);
            sprite.index = 0;
            sprite.positions = [{
                y: 9,
                x: 8
            }, {
                y: 9,
                x: 33
            }, {
                y: 9,
                x: 57
            }, {
                y: 9,
                x: 79
            }, {
                y: 9,
                x: 101
            }, {
                y: 9,
                x: 126
            }, {
                y: 9,
                x: 151
            }, {
                y: 9,
                x: 173
            }];
        },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingLeftState");
        },
        deactivated: function (entity, system) { }
    };

    var runningUpState = {
        activated: function (entity, system) { },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingUpState");
        },
        deactivated: function (entity, system) { }
    };

    var runningDownState = {
        activated: function (entity, system) { },
        update: function (entity, system) {
            handleStateChangeByInput(entity, system, "standingDownState");
        },
        deactivated: function (entity, system) { }
    };

    var movingStates = {
        standingDownState: standingDownState,
        standingUpState: standingUpState,
        standingLeftState: standingLeftState,
        standingRightState: standingRightState,
        runningDownState: runningDownState,
        runningUpState: runningUpState,
        runningLeftState: runningLeftState,
        runningRightState: runningRightState,
        strikingDownState: strikingDownState,
        strikingUpState: strikingUpState,
        strikingLeftState: strikingLeftState,
        strikingRightState: strikingRightState
    };

    app.systems.PlayerSystem = function (inputSystem, collisionSystem, inputMapping) {
        this.game = null;
        var timer = null;
        this.isReady = true;
        this.entities = [];
        this.inputSystem = inputSystem;
        this.collisionSystem = collisionSystem;

        this.inputMapping = inputMapping || {
            "37": "runningLeftState",
            "38": "runningUpState",
            "39": "runningRightState",
            "40": "runningDownState"
        };
    };

    app.systems.PlayerSystem.prototype.updatePlayer = function (entity) {
        var playerState = entity.getComponentByType(PlayerState);
        var stateName = playerState.name;
        var system = this;

        movingStates[stateName].update(entity, system);

        var newStateName = playerState.name;

        if (newStateName !== stateName) {
            movingStates[stateName].deactivated(entity, system);
            movingStates[newStateName].activated(entity, system);
            movingStates[newStateName].update(entity, system);
        }
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
        this.timer = this.game.timer;
        this.cacheEntities();

        var entity = null;
        var entities = this.entities;
        var length = entities.length;
        var stateName = null;
        var playerState = null;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            playerState = entity.getComponentByType(PlayerState);
            stateName = playerState.name;

            movingStates[stateName].activated(entity, this);
        }
    };

    app.systems.PlayerSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };


});