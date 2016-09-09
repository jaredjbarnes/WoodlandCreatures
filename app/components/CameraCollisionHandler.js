BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.CameraCollisionHandler = function () {
        this["@class"] = "app.components.CameraCollisionHandler";
        this.type = "collision-handler";
        this.name = null;
        this.intersectingEntitiesById = {};
    };

    app.components.CameraCollisionHandler.prototype.collisionStart = function (otherEntity) {
        this.intersectingEntitiesById[otherEntity.id] = otherEntity;
    };

    app.components.CameraCollisionHandler.prototype.collisionEnd = function (otherEntity) {
        delete this.intersectingEntitiesById[otherEntity.id];
    };


});