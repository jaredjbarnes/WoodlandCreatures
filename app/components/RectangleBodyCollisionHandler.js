BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.RectangleBodyCollisionHandler = function () {
        this["@class"] = "app.components.RectangleBodyCollisionHandler";
        this.type = "collision-handler";
        this.name = "prop";
        this.entity = null;
        this.size = null;
        this.position = null;
        this.size = null;
        this.rectangleBody = null;
        this.otherRectangleBody = null;
        this.otherSize = null;
        this.otherPosition = null;
        this.isInitialized = false;
    };

    app.components.RectangleBodyCollisionHandler.prototype.initialize = function (entity) {
        this.entity = entity;
        this.rectangleBody = entity.getProperty("rectangle-body");
        this.size = entity.getProperty("size");
        this.position = entity.getProperty("position");
        this.movement = entity.getProperty("movement");
    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionStart = function (otherEntity) {
        var entity = this.entity;

        var otherSize = this.otherSize = otherEntity.getProperty("size");
        var otherPosition = this.otherPosition = otherEntity.getProperty("position");
        var otherRectangleBody = this.otherRectangleBody = otherEntity.getProperty("rectangle-body");

        if (otherRectangleBody == null) {
            return;
        }

        var size = this.size;
        var position = this.position;
        var rectangleBody = this.rectangleBody;
        var movement = this.movement;

        var top = Math.max(position.y + rectangleBody.position.y, otherPosition.y + otherRectangleBody.position.y);
        var left = Math.max(position.x + rectangleBody.position.x, otherPosition.x + otherRectangleBody.position.x);
        var right = Math.min(position.x + rectangleBody.position.x + rectangleBody.size.width, otherPosition.x + otherRectangleBody.position.x + otherRectangleBody.size.width);
        var bottom = Math.min(position.y + rectangleBody.position.y + rectangleBody.size.height, otherPosition.y + otherRectangleBody.position.y + otherRectangleBody.size.height);

        if (top < bottom && left < right) {
            position.y = movement.previousPosition.y;
            position.x = movement.previousPosition.x;
            movement.position.y = position.y;
            movement.position.x = position.x;
        }

    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionActive = function (otherEntity) {
        var entity = this.entity;

        var otherSize = this.otherSize;
        var otherPosition = this.otherPosition;
        var otherRectangleBody = this.otherRectangleBody;

        var size = this.size;
        var position = this.position;
        var rectangleBody = this.rectangleBody;
        var movement = this.movement;

        if (otherRectangleBody == null) {
            return;
        }

        var top = Math.max(position.y + rectangleBody.position.y, otherPosition.y + otherRectangleBody.position.y);
        var left = Math.max(position.x + rectangleBody.position.x, otherPosition.x + otherRectangleBody.position.x);
        var right = Math.min(position.x + rectangleBody.position.x + rectangleBody.size.width, otherPosition.x + otherRectangleBody.position.x + otherRectangleBody.size.width);
        var bottom = Math.min(position.y + rectangleBody.position.y + rectangleBody.size.height, otherPosition.y + otherRectangleBody.position.y + otherRectangleBody.size.height);

        if (top < bottom && left < right) {
            position.y = movement.previousPosition.y;
            position.x = movement.previousPosition.x;
            movement.position.y = position.y;
            movement.position.x = position.x;
        }

    };

    app.components.RectangleBodyCollisionHandler.prototype.collisionEnd = function () {
        this.otherRectangleBody = null;
        this.otherSize = null;
        this.otherPosition = null;
    }

});