BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Transform = function () {
        this["@class"] = "app.properties.Transform";
        this.type = "transform";
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    };

});

