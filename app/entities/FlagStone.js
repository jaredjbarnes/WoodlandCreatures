BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.Ground",
    "app.properties.Mapable"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var Ground = app.properties.Ground;
    var Mapable = app.properties.Mapable;

    app.entities.FlagStone = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.FlagStone";
        this.type = "flag-stone";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 103;
        image.position.y = 1;
        image.size.width = 16;
        image.size.height = 16;

        var size = new Size();
        size.width = 16;
        size.height = 16;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var ground = new Ground();

        var mapable = new Mapable();
        mapable.color.red = 162;
        mapable.color.green = 224;
        mapable.color.blue = 170;

        this.addProperty(mapable);
        this.addProperty(ground);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.FlagStone, app.Entity);

});