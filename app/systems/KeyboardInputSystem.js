BASE.require([], function () {

    BASE.namespace("app.systems");

    var hasKeyboardProperty = function (entity) {
        var keyboard = entity.properties["keyboard-input"];
        return keyboard && keyboard.length > 0;
    };

    app.systems.KeyboardInputSystem = function (document) {
        this.document = document;
        this.pressedKeys = {};
        this.isReady = true;
    };

    app.systems.KeyboardInputSystem.prototype.keyDownListener = function (event) {
        this.pressedKeys[event.keyCode] = true;
    };

    app.systems.KeyboardInputSystem.prototype.keyUpListener = function (event) {
        this.pressedKeys[event.keyCode] = false;
    };

    app.systems.KeyboardInputSystem.prototype.activated = function (game) {
        var document = this.document;
        var pressedKeys = this.pressedKeys;

        this.entities = game.rootEntity.filter(hasKeyboardProperty).forEach(function (entity) {
            var keyboardProperty = entity.properties["keyboard-input"][0];
            keyboardProperty.pressedKeys = pressedKeys;
        });

        document.body.addEventListener("keydown", this.keyDownListener, false);
        document.body.addEventListener("keyup", this.keyUpListener, false);
    }

    app.systems.KeyboardInputSystem.prototype.deactivated = function () {
        var document = this.document;
        document.body.removeEventListener("keydown", this.keyDownListener, false);
        document.body.removeEventListener("keyup", this.keyUpListener, false);
    };

    app.systems.KeyboardInputSystem.prototype.entityAdded = function (entity) {
        if (hasKeyboardProperty(entity)) {
            var keyboardProperty = entity.properties["keyboard-input"][0];
            keyboardProperty.pressedKeys = this.pressedKeys;
        }
    };

});