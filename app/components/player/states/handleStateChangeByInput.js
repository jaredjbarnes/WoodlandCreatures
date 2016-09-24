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
        var keyboardInput = entity.getProperty("keyboard-input");
        var movement = entity.getProperty("movement");
        var state = entity.getProperty("state");
        var touchInput = entity.getProperty("touch-input");
        var isNothing = true;
        var x;
        var y;
        var hypotenuse;

        movementKeys.forEach(function (key) {
            if (keyboardInput.pressedKeys[key]) {
                invokeMethod(movements, key, [movement]);
                isNothing = false;
            }
        });

        if (isNothing) {

            if (!touchInput.isTouching) {
                state.name = nothingState;
            } else {
                hypotenuse = Math.sqrt(Math.pow(touchInput.x, 2) + Math.pow(touchInput.y, 2));
                x = touchInput.x / hypotenuse;
                y = touchInput.y / hypotenuse;

                movement.position.x += (x*2);
                movement.position.y += (y*2);

                if (Math.abs(x) > Math.abs(y)) {
                    if (x > 0) {
                        state.name = "runningRight";
                    } else {
                        state.name = "runningLeft";
                    }
                } else {
                    if (y > 0) {
                        state.name = "runningDown";
                    } else {
                        state.name = "runningUp";
                    }
                }
            }

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