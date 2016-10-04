BASE.require([
    "app.Entity",
    "app.properties.Camera",
    "app.properties.Collidable",
    "app.properties.PositionConstraint",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.Movement"
], function () {

    BASE.namespace("app.entities");

    var Camera = app.properties.Camera;
    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Movement = app.properties.Movement;
    var PositionConstraint = app.properties.PositionConstraint;
    var Collision = app.properties.Collidable;

    app.entities.Camera = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Camera";
        this.type = "camera";

        var size = new Size();
        size.width = 600;
        size.height = 300;

        var position = new Position();
        position.x = 10;
        position.y = 10;

        var movement = new Movement();

        var collision = new Collision();

        var camera = new Camera();
        camera.name = "character";

        var positionConstraint = new PositionConstraint();
        positionConstraint.byEntityId = "root";

        this.addProperty(positionConstraint);
        this.addProperty(position);
        this.addProperty(movement);
        this.addProperty(size);
        this.addProperty(collision);
        this.addProperty(camera);
    };

    BASE.extend(app.entities.Camera, app.Entity);

});