BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Movement = function () {
        this["@class"] = "app.properties.Movement";
        this.type = "movement";
        this.position = {
            x: 0,
            y: 0
        };
        this.previousPosition = {
            x: 0,
            y: 0
        };
    };

});

