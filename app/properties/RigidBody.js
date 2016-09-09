BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.RigidBody = function () {
        this["@class"] = "app.properties.RigidBody";
        this.type = "rigid-body";
        this.bodyType = "polygon"
    };

});