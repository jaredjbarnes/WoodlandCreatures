BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.OneWayBinding = function () {
        this["@type"] = "app.properties.OneWayBinding";
        this.type = "app.properties.OneWayBinding";
        this.objects = [];
        this.propertyNames = [];
    };

});