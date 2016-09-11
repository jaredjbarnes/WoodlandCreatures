BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Size = function () {
        this["@class"] = "app.properties.Size";
        this.type = "size";
        this.width = 0;
        this.height = 0;
    };

});

