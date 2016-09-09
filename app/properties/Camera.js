BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.Camera = function () {
        this["@class"] = "app.properties.Camera";
        this.type = "camera";
        this.name = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    };

});



