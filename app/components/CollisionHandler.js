BASE.require([], function () {

    BASE.namespace("app.components");

    app.components.CollisionHandler = function () {
        this["@class"] = "app.components.CollisionHandler";
        this.type = "collision-handler";
        this.entity = null;
        this.isInitialized = false;
        this.name = null;
    };

    app.components.CollisionHandler.initialize = function (entity) {
        this.entity = entity;
        this.isInitialized = true;
    };


});