BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.FollowCameraController = function () {
        this["@class"] = "app.components.FollowCameraController";
        this.type = "camera-controller";
        this.name = null;
        this.entity = null;
        this.cameraTransform = null;
        this.followId = null;
        this.followEntity = null;
        this.followEntityTransform = null;
    };

    app.components.FollowCameraController.prototype.findFollowEntity = function () {
        var followId = this.followId;
        this.followEntity = this.game.rootEntity.filter(function (entity) {
            return entity.id === followId;
        })[0] || null;

        if (this.followEntity != null) {
            this.followEntityTransform = this.followEntity.properties["transform"][0];
        }
    };

    app.components.FollowCameraController.prototype.activated = function (entity, game) {
        this.game = game;
        this.entity = entity;
        this.cameraTransform = entity.properties["transform"][0];
        this.restraint = entity.properties["restraint"][0];
        this.findFollowEntity();
    };

    app.components.FollowCameraController.prototype.update = function () {
        if (this.followEntity != null) {
            var transform = this.followEntityTransform;
            var cameraTransform = this.cameraTransform;
            var restraint = this.restraint;

            var middleX = transform.x + (transform.width / 2);
            var middleY = transform.y + (transform.height / 2);

            cameraTransform.x = middleX - (cameraTransform.width / 2);
            cameraTransform.y = middleY - (cameraTransform.height / 2);

            if (restraint == null || cameraTransform == null) {
                return;
            }

            if (cameraTransform.x < restraint.transform.x) {
                cameraTransform.x = restraint.transform.x;
            }

            if (cameraTransform.y < restraint.transform.y) {
                cameraTransform.y = restraint.transform.y
            }

            if (cameraTransform.x + cameraTransform.width > restraint.transform.x + restraint.transform.width) {
                cameraTransform.x = restraint.transform.x + restraint.transform.width - cameraTransform.width;
            }

            if (cameraTransform.y + cameraTransform.height > restraint.transform.y + restraint.transform.height) {
                cameraTransform.y = restraint.transform.y + restraint.transform.height - cameraTransform.height;
            }
        }
    };

    app.components.FollowCameraController.prototype.deactivated = function () {
    };


});