BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.OneWayBinding = function () {
        this["@class"] = "app.properties.OneWayBinding";
        this.type = "one-way-binding";
        this.objects = [];
        this.propertyNames = [];
    };

});