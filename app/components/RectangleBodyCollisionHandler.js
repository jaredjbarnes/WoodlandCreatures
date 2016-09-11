BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.RectangleBodyCollisionHandler = function () {
        this["@class"] = "app.components.RectangleBodyCollisionHandler";
        this.type = "collision-handler";
        this.name = null;
        this.entity = null;
        this.isInitialized = false;
    };

    app.components.RectangleBodyCollisionHandler.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionStart = function (otherEntity) {
    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionEnd = function (otherEntity) {
    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionActive = function (otherEntity) {
    };

});