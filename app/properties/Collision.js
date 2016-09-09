BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.Collision = function () {
        this["@class"] = "app.properties.Collision";
        this.type = "collision";
        this.isStatic = false;
        this.enabled = true;
        this.activeCollisions = {};
        this.name = null;
    };

});