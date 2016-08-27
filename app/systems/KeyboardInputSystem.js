BASE.require([], function () {

    BASE.namespace("app.systems");

    app.systems.KeyboardInputSystem = function (document) {

        var pressedKeys = this.pressedKeys = {};

        var keyDownListener = function (event) {
            pressedKeys[event.keyCode] = true;
        };

        var keyUpListener = function (event) {
            pressedKeys[event.keyCode] = false;
        };

        var bind = function (game) {
            document.body.addEventListener("keydown", keyDownListener, false);
            document.body.addEventListener("keyup", keyUpListener, false);
        };

        var unbind = function () {
            document.body.removeEventListener("keydown", keyDownListener, false);
            document.body.removeEventListener("keyup", keyUpListener, false);
        };

        this.activated = bind;
        this.deactivated = unbind;
        this.isReady = true;
    };

});