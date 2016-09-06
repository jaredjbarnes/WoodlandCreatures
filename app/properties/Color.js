BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.Color = function () {
        this["@type"] = "app.properties.Color";
        this.type = "app.properties.Color";
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;
    };

});



