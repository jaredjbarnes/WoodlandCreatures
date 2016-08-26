BASE.require([], function () {

    BASE.namespace("app.systems");

    app.systems.KeyboardInputSystem = function (document) {

        var currentKeyPresses = {};

        var keyDownListener = function (event) {
            currentKeyPresses[event.keyCode] = true;
        };

        var keyUpListener = function (event) {
            currentKeyPresses[event.keyCode] = false;
        };

        var bind = function (game) {
            document.body.addEventListener("keydown", keyDownListener, false);
            document.body.addEventListener("keyup", keyUpListener, false);
        };

        var unbind = function () {
            document.body.removeEventListener("keydown", keyDownListener, false);
            document.body.removeEventListener("keyup", keyUpListener, false);
        };

        this.started = bind;
        this.paused = unbind;

    };

});