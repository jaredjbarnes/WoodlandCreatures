BASE.require([
    "app.Entity",
    "app.properties.Size",
    "app.properties.Position",
    "app.entities.Camera",
    "app.properties.ImageTexture",
    "app.properties.Collidable"
], function () {

    BASE.namespace("app.entities");

    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Camera = app.entities.Camera;
    var ImageTexture = app.properties.ImageTexture;
    var Collision = app.properties.Collidable;

    app.entities.Stage = function () {
        app.Entity.call(this);

        this.type = "stage";
        this.id = "root";

        var worldSize = new Size();
        worldSize.width = 2000;
        worldSize.height = 1000;

        var position = new Position();
        position.x = 0;
        position.y = 0;

        var collision = new Collision();
        collision.isStatic = true;

        this.addProperty(worldSize);
        this.addProperty(position);
    };

    BASE.extend(app.entities.Stage, app.Entity);

});