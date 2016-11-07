BASE.require([
    "app.Entity",
    "app.properties.Camera",
    "app.properties.Collidable",
    "app.properties.PositionConstraint",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.Mapable"
], function () {

    BASE.namespace("app.entities");

    var Camera = app.properties.Camera;
    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var PositionConstraint = app.properties.PositionConstraint;
    var Collision = app.properties.Collidable;
    var Mapable = app.properties.Mapable;

    app.entities.Camera = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Camera";
        this.type = "camera";

        var size = new Size();
        size.width = 600;
        size.height = 300;

        var position = new Position();
        position.x = 0;
        position.y = 0;

        var collision = new Collision();

        var camera = new Camera();
        camera.name = "character";

        var positionConstraint = new PositionConstraint();
        positionConstraint.byEntityId = "root";

        var mapable = new Mapable();
        mapable.border.color.red = 0;
        mapable.border.color.green = 144;
        mapable.border.color.blue = 255;
        mapable.border.color.alpha = 1;
        mapable.border.thickness = 1;
        mapable.color.alpha = 0;

        this.addProperty(positionConstraint);
        this.addProperty(position);
        this.addProperty(mapable);
        this.addProperty(size);
        this.addProperty(collision);
        this.addProperty(camera);
    };

    BASE.extend(app.entities.Camera, app.Entity);

});