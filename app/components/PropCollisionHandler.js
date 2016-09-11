BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.PropCollisionHandler = function () {
        this["@class"] = "app.components.CameraCollisionHandler";
        this.type = "collision-handler";
        this.name = "prop";
        this.entity = null;
        this.isInitialized = false;
    };

    app.components.PropCollisionHandler.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.PropCollisionHandler.prototype.collisionStart = function (otherEntity) {
        var entity = this.entity;
        var propSize = otherEntity.getProperty("size");
        var propPosition = otherEntity.getProperty("position");
        var size = entity.getProperty("size");
        var position = entity.getProperty("position");
        var movement = entity.properties["movement"][0];

        var propMiddleX = propPosition.x + (propSize.width / 2);
        var middleX = position.x + (size.width / 2);
        var propMiddleY = propPosition.y + (propSize.height / 2);
        var middleY = position.y + (size.height / 2);

        position.y = movement.previousPosition.y;
        position.x = movement.previousPosition.x;
        movement.position.y = position.y;
        movement.position.x = position.x;

    };

});