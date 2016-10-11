BASE.require([
    "Array.prototype.orderBy",
    "app.systems.CameraSystem"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };
    var CameraSystem = app.systems.CameraSystem;

    app.systems.FollowEntityCameraSystem = function (canvas, camera, entityToFollow) {
        var self = this;

        CameraSystem.call(this, canvas, camera);
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
        var cameraPosition = this.cameraPosition;
        var positionConstraint = this.positionConstraint;

        var middleX = followEntityPosition.x + (followEntitySize.width / 2);
        var middleY = followEntityPosition.y + (followEntitySize.height / 2);

        cameraPosition.x = Math.floor(middleX - (cameraSize.width / 2));
        cameraPosition.y = Math.floor(middleY - (cameraSize.height / 2));

        if (positionConstraint == null || cameraSize == null || cameraPosition == null) {
            return;
        }

        if (cameraPosition.x + cameraSize.width > positionConstraint.position.x + positionConstraint.size.width) {
            cameraPosition.x = positionConstraint.position.x + positionConstraint.size.width - cameraSize.width;
        }

        if (cameraPosition.y + cameraSize.height > positionConstraint.position.y + positionConstraint.size.height) {
            cameraPosition.y = positionConstraint.position.y + positionConstraint.size.height - cameraSize.height;
        }

        if (cameraPosition.x < positionConstraint.position.x) {
            cameraPosition.x = positionConstraint.position.x;
        }

        if (cameraPosition.y < positionConstraint.position.y) {
            cameraPosition.y = positionConstraint.position.y
        }
    };

});