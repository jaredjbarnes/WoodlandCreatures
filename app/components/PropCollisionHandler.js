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
        var propTransform = otherEntity.properties["transform"][0];
        var transform = entity.properties["transform"][0];
        var movement = entity.properties["movement"][0];

        var propMiddleX = propTransform.x + (propTransform.width / 2);
        var middleX = transform.x + (transform.width / 2);
        var propMiddleY = propTransform.y + (propTransform.height / 2);
        var middleY = transform.y + (transform.height / 2);

        var left = Math.max(propTransform.x, transform.x);
        var top = Math.max(propTransform.y, transform.y);
        var right = Math.min(propTransform.x + propTransform.width, transform.x + transform.width);
        var bottom = Math.min(propTransform.y + propTransform.height, transform.y + transform.height);

        if (left < right && top < bottom) {

            if (Math.abs(movement.y - movement.lastY) >= Math.abs(movement.x - movement.lastX)) {
                transform.x = movement.lastX;
                movement.x = transform.x;

                if (propMiddleY < movement.lastY) {
                    transform.y = bottom;
                    movement.y = bottom
                } else {
                    transform.y = top - transform.height;
                    movement.y = transform.y;
                }

            } else {
                transform.y = movement.lastY;
                movement.y = transform.y;

                if (propMiddleX < movement.lastX) {
                    transform.x = right;
                    movement.x = right
                } else {
                    transform.x = left - transform.width;
                    movement.x = transform.x;
                }
            }

        }
    };

});