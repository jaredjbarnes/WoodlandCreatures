BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Movement = function () {
        this["@class"] = "app.properties.Movement";
        this.type = "movement";
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
    };

});

