BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.Restraint = function () {
        this["@class"] = "app.properties.Restraint";
        this.type = "restraint";
        this.byEntityId = null;
        this.transform = null;
    };

});