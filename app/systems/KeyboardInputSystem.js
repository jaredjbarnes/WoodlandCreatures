BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.systems");

    var hasKeyboardProperty = function (entity) {
        var keyboard = entity.properties["keyboard-input"];
        return keyboard && keyboard.length > 0;
    };

    app.systems.KeyboardInputSystem = function (document, mapping) {
        var self = this;
        this.document = document;
        this.pressedKeys = {};
        this.isReady = true;
        this.mapping = mapping || {};

        this.keyDownListener = function (event) {
            var keyCode = event.keyCode;
            var alias = mapping[keyCode];

            self.pressedKeys[keyCode] = true;

            if (alias != null) {
                self.pressedKeys[alias] = true;
            }
        };

        this.keyUpListener = function (event) {
            var keyCode = event.keyCode;
            var alias = mapping[keyCode];

            self.pressedKeys[keyCode] = false;

            if (alias != null) {
                self.pressedKeys[alias] = false;
            }
        };
    };

    app.systems.KeyboardInputSystem.prototype.activated = function (game) {
        var document = this.document;
        var pressedKeys = this.pressedKeys;
        var $body = $(document.body);

        this.entities = game.stage.filter(hasKeyboardProperty).forEach(function (entity) {
            var keyboardProperty = entity.properties["keyboard-input"][0];
            keyboardProperty.pressedKeys = pressedKeys;
        });

        $body.on("keydown", this.keyDownListener);
        $body.on("keyup", this.keyUpListener);

    }

    app.systems.KeyboardInputSystem.prototype.deactivated = function () {
        var document = this.document;
        var $body = $(document.body);

        $body.off("keydown", this.keyDownListener);
        $body.off("keyup", this.keyUpListener);
    };

    app.systems.KeyboardInputSystem.prototype.entityAdded = function (entity) {
        if (hasKeyboardProperty(entity)) {
            var keyboardProperty = entity.properties["keyboard-input"][0];
            keyboardProperty.pressedKeys = this.pressedKeys;
        }
    };

});