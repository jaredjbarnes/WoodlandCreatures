BASE.require([
    "app.Entity",
    "app.properties.Camera",
    "app.components.CameraCollisionHandler",
    "app.components.FollowCameraController",
    "app.properties.Collision",
    "app.properties.Restraint",
    "app.properties.Transform"
], function () {

    BASE.namespace("app.entities");

    var Camera = app.properties.Camera;
    var Transform = app.properties.Transform;
    var Restraint = app.properties.Restraint;
    var Collision = app.properties.Collision;
    var CameraCollisionHandler = app.components.CameraCollisionHandler;
    var FollowCameraController = app.components.FollowCameraController;

    app.entities.Camera = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Camera";
        this.type = "camera";

        var transform = new Transform();
        transform.x = 10;
        transform.y = 10;
        transform.width = 500;
        transform.height = 300;

        var cameraCollisionHandler = new CameraCollisionHandler();
        var collision = new Collision();

        var camera = new Camera();
        camera.name = "character";

        var followCameraController = new FollowCameraController();
        followCameraController.followId = "main-character";

        var restraint = new Restraint();
        restraint.byEntityId = "root";

        this.addProperty(restraint);
        this.addProperty(transform);
        this.addProperty(collision);
        this.addProperty(camera);

        this.addComponent(followCameraController);
        this.addComponent(cameraCollisionHandler);

    };

    BASE.extend(app.entities.Camera, app.Entity);

});