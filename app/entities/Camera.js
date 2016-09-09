BASE.require([
    "app.Entity",
    "app.properties.Camera",
    "app.components.CameraCollisionHandler",
    "app.properties.Collision",
    "app.properties.Transform"
], function () {

    BASE.namespace("app.entities");

    var Camera = app.properties.Camera;
    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;
    var CameraCollisionHandler = app.components.CameraCollisionHandler;

    app.entities.Player = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Camera";
        this.type = "camera";

        var transform = new Transform();
        transform.x = 10;
        transform.y = 10;
        transform.width = 300;
        transform.height = 400;

        var cameraCollisionHandler = new CameraCollisionHandler();
        var collision = new Collision();

        var camera = new Camera();
        camera.name = "character";

        this.addProperty(transform);
        this.addProperty(collision);

        this.addComponent(cameraCollisionHandler);
    };

    BASE.extend(app.entities.Player, app.Entity);

});