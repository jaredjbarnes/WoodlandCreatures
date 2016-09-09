BASE.require([
], function () {

    BASE.namespace("app.components.player.states");

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var movements = {
        up: function (transform) {
            transform.y -= 2;
        },
        left: function (transform) {
            transform.x -= 2;
        },
        right: function (transform) {
            transform.x += 2;
        },
        down: function (transform) {
            transform.y += 2;
        }
    };

    var movementToState = {
        up: "runningUp",
        left: "runningLeft",
        right: "runningRight",
        down: "runningDown"
    };

    var movementKeys = Object.keys(movements);

    app.components.player.states.handleStateChangeByInput = function (entity, nothingState) {
        var keyboardInput = entity.properties["keyboard-input"][0];
        var transform = entity.properties["transform"][0];
        var state = entity.properties["state"][0];
        var isNothing = true;

        movementKeys.forEach(function (key) {
            if (keyboardInput.pressedKeys[key]) {
                invokeMethod(movements, key, [transform]);
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