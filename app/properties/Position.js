BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Position = function () {
        this["@class"] = "app.properties.Position";
        this.type = "position";
        this.x = 0;
        this.y = 0;
    };

});

