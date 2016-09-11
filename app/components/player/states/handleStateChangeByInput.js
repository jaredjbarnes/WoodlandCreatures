BASE.require([
], function () {

    BASE.namespace("app.components.player.states");

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var movements = {
        up: function (movement) {
            movement.position.y -= 2;
        },
        left: function (movement) {
            movement.position.x -= 2;
        },
        right: function (movement) {
            movement.position.x += 2;
        },
        down: function (movement) {
            movement.position.y += 2;
        }
    };

    var movementToState = {
        left: "runningLeft",
        right: "runningRight",
        up: "runningUp",
        down: "runningDown"
    };

    var movementKeys = Object.keys(movements);

    app.components.player.states.handleStateChangeByInput = function (entity, nothingState) {
        var keyboardInput = entity.properties["keyboard-input"][0];
        var movement = entity.properties["movement"][0];
        var state = entity.properties["state"][0];
        var isNothing = true;

        movementKeys.forEach(function (key) {
            if (keyboardInput.pressedKeys[key]) {
                invokeMethod(movements, key, [movement]);
                isNothing = false;
            }
        });

        if (isNothing) {
            state.name = nothingState;
        } else {
            movementKeys.every(function (key) {
                if (keyboardInput.pressedKeys[key]) {
                    state.name = movementToState[key];
                    return false;
                }
                return true;
            });
        }
    };

});