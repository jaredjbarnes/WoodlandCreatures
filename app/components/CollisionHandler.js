BASE.require([], function () {

    BASE.namespace("app.components");

    app.components.CollisionHandler = function () {
        this["@class"] = "app.components.CollisionHandler";
        this.type = "collision-handler";
        this.entity = null;
        this.isInitialized = false;

        // null means it will handle all collisions. Otherwise you can specify
        // a type with a string and have multiple collision handlers on an entity.
        this.type = null;
    };

    app.components.CollisionHandler.initialize = function (entity) {
        this.entity = entity;
        this.isInitialized = true;
    };


});