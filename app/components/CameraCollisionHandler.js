BASE.require([
    "app.components.CollisionHandler"
], function () {

    BASE.namespace("app.components");

    app.components.CameraCollisionHandler = function () {
        this["@type"] = "app.components.CameraCollisionHandler";
        this.type = "app.components.CollisionHandler";
        this.entity = null;
        this.isInitialized = false;
        this.intersectingEntitiesById = {};
    };

    BASE.extend(app.components.CameraCollisionHandler, app.components.CollisionHandler);

    app.components.CameraCollisionHandler.collisionStart = function (otherEntity) {
        this.intersectingEntitiesById[otherEntity.id] = otherEntity;
    };

    app.components.CameraCollisionHandler.collisionEnd = function (otherEntity) {
        delete this.intersectingEntitiesById[otherEntity.id];
    };


});