BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.Collidable = function () {
        this["@class"] = "app.properties.Collidable";
        this.type = "collidable";
        this.isStatic = false;
        this.enabled = true;
        this.activeCollisions = {};
        this.name = null;
        this.collidableNames = [];
    };

});