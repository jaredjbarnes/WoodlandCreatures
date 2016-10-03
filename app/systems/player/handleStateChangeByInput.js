BASE.require([
], function () {

    BASE.namespace("app.systems.player");

    var invokeMethod = function (obj, methodName, args) {
        if (obj != null  && typeof obj[methodName] === "function") {
           return  obj[methodName].apply(obj, args);
        }
    };

    var MOVE_BY = 2;

    var movements = {
        left: function (movement) {
            movement.position.x -= MOVE_BY;
        },
        right: function (movement) {
            movement.position.x += MOVE_BY;
        },
        up: function (movement) {
            movement.position.y -= MOVE_BY;
        },
        down: function (movement) {
            movement.position.y += MOVE_BY;
        }
    };

    var movementToState = {
        left: "runningLeft",
        right: "runningRight",
        up: "runningUp",
        down: "runningDown"
    };

    var movementKeys = Object.keys(movements);

    app.systems.player.handleStateChangeByInput = function (entity, nothingState) {
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

                movement.position.x += (x * MOVE_BY);
                movement.position.y += (y * MOVE_BY);

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