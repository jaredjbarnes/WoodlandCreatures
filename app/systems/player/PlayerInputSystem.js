BASE.require([
    "app.components.PlayerState",
    "app.components.Rect"
], function () {

    BASE.namespace("app.systems.player");

    var PlayerState = app.components.PlayerState;
    var Rect = app.components.Rect;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var movements = {
        up: function (rect) {
            rect.top -= 2;
        },
        left: function (rect) {
            rect.left -= 2;
        },
        right: function (rect) {
            rect.left += 2;
        },
        down: function (rect) {
            rect.top += 2;
        }
    };

    var handleStateChangeByInput = function (entity, system, nothingState) {
        var inputSystem = system.inputSystem;
        var inputMapping = system.inputMapping;
        var mappingKeys = Object.keys(inputMapping);
        var playerState = entity.getComponentByType(PlayerState);
        var rect = entity.getComponentByType(Rect);
        var isNothing = true;

        mappingKeys.forEach(function (key) {
            if (inputSystem.pressedKeys[key]) {
                invokeMethod(movements, key, [rect]);
                isNothing = false;
            }
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

    app.systems.player.PlayerInputSystem = function () {
        this.game = null;
    };

    app.systems.player.PlayerInputSystem.prototype.states = {
        standingDownState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingDownState");
            }
        },
        standingUpState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingUpState");
            }
        },
        standingLeftState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingLeftState");
            }
        },
        standingRightState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingRightState");
            }
        },
        runningDownState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingDownState");
            }
        },
        runningUpState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingUpState");
            }
        },
        runningLeftState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingLeftState");
            }
        },
        runningRightState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingRightState");
            }
        },
        strikingDownState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingDownState");
            }
        },
        strikingUpState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingUpState");
            }
        },
        strikingLeftState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingLeftState");
            }
        },
        strikingRightState: {
            update: function (entity, playerSystem) {
                handleStateChangeByInput(entity, playerSystem, "standingRightState");
            }
        }
    };

});