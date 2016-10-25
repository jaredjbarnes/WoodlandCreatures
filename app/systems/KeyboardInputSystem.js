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
            self.pressedKeys[event.keyCode] = true;

            if (mapping[event.keyCode] != null) {
                self.pressedKeys[mapping[event.keyCode]] = true;
            }
        };

        this.keyUpListener = function (event) {
            self.pressedKeys[event.keyCode] = false;

            if (mapping[event.keyCode] != null) {
                self.pressedKeys[mapping[event.keyCode]] = false;
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