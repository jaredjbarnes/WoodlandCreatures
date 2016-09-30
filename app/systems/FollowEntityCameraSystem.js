BASE.require([
    "Array.prototype.orderBy",
    "app.systems.CameraSystem"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };
    var CameraSystem = app.systems.CameraSystem;

    app.systems.FollowEntityCameraSystem = function (canvas, camera, entityToFollow) {
        var self = this;

        CameraSystem.call(this, canvas);
        this.setCamera(camera);

        this.entityToFollow = entityToFollow;
        this.camera = camera;
        this.positionConstraint = camera.getProperty("position-constraint");
    };

    BASE.extend(app.systems.FollowEntityCameraSystem, CameraSystem);

    app.systems.FollowEntityCameraSystem.prototype.positionCamera = function () {
        var entity = this.entityToFollow;
        var followEntitySize = entity.getProperty("size");
        var followEntityPosition = entity.getProperty("position");
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
    };

});