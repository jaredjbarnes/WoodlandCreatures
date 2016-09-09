BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.KeyboardInput = function () {
        this["@class"] = "app.properties.KeyboardInput";
        this.type = "keyboard-input";
        this.pressedKeys = {};
    };

});



