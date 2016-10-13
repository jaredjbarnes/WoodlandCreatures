BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.MapColor = function () {
        this["@class"] = "app.properties.MapColor";
        this.type = "map-color";
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;
    };

});



