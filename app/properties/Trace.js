BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.Trace = function () {
        this["@class"] = "app.properties.Trace";
        this.type = "trace";
        this.enabled = true;
    };
});



