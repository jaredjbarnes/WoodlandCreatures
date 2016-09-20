BASE.require([
], function () {

    BASE.namespace("app.components");

    app.components.FollowCameraController = function () {
        this["@class"] = "app.components.FollowCameraController";
        this.type = "camera-controller";
        this.name = null;
        this.entity = null;
        this.cameraSize = null;
        this.cameraMovement = null;
        this.followId = null;
        this.followEntity = null;
        this.followEntitySize = null;
        this.followEntityPosition = null;
    };

    app.components.FollowCameraController.prototype.findFollowEntity = function () {
        var followId = this.followId;
        this.followEntity = this.game.stage.filter(function (entity) {
            return entity.id === followId;
        })[0] || null;

        if (this.followEntity != null) {
            this.followEntitySize = this.followEntity.getProperty("size");
            this.followEntityPosition = this.followEntity.getProperty("position");
        }
    };

    app.components.FollowCameraController.prototype.activated = function (entity, game) {
        this.game = game;
        this.entity = entity;
        this.cameraSize = entity.getProperty("size");
        this.cameraMovement = entity.getProperty("movement");
        this.positionConstraint = entity.getProperty("position-constraint");
        this.findFollowEntity();
    };

    app.components.FollowCameraController.prototype.update = function () {
        if (this.followEntity != null) {
            var followEntitySize = this.followEntitySize;
            var followEntityPosition = this.followEntityPosition;
            var cameraSize = this.cameraSize;
            var cameraMovement = this.cameraMovement;
            var positionConstraint = this.positionConstraint;

            var middleX = followEntityPosition.x + (followEntitySize.width / 2);
            var middleY = followEntityPosition.y + (followEntitySize.height / 2);

            cameraMovement.position.x = Math.floor(middleX - (cameraSize.width / 2));
            cameraMovement.position.y = Math.floor(middleY - (cameraSize.height / 2));

            if (positionConstraint == null || cameraSize == null || cameraMovement == null) {
                return;
            }

            if (cameraMovement.position.x + cameraSize.width > positionConstraint.position.x + positionConstraint.size.width) {
                cameraMovement.position.x = positionConstraint.position.x + positionConstraint.size.width - cameraSize.width;
            }

            if (cameraMovement.position.y + cameraSize.height > positionConstraint.position.y + positionConstraint.size.height) {
                cameraMovement.position.y = positionConstraint.position.y + positionConstraint.size.height - cameraSize.height;
            }

            if (cameraMovement.position.x < positionConstraint.position.x) {
                cameraMovement.position.x = positionConstraint.position.x;
            }

            if (cameraMovement.position.y < positionConstraint.position.y) {
                cameraMovement.position.y = positionConstraint.position.y
            }

        }
    };

    app.components.FollowCameraController.prototype.deactivated = function () {
    };


});