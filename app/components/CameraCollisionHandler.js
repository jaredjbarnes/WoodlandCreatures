BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.CameraCollisionHandler = function () {
        this["@class"] = "app.components.CameraCollisionHandler";
        this.type = "collision-handler";
        this.intersectingEntitiesById = {};
    };

    app.components.CameraCollisionHandler.collisionStart = function (otherEntity) {
        this.intersectingEntitiesById[otherEntity.id] = otherEntity;
    };

    app.components.CameraCollisionHandler.collisionEnd = function (otherEntity) {
        delete this.intersectingEntitiesById[otherEntity.id];
    };


});