BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody",
    "app.properties.MapColor"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;
    var MapColor = app.properties.MapColor;

    app.entities.Tree = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Tree";
        this.type = "tree";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 50;
        image.position.y = 539;
        image.size.width = 65;
        image.size.height = 80;

        var size = new Size();
        size.width = 65;
        size.height = 80;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 2,
            y: 35
        }, {
            x: 64,
            y: 35
        }, {
            x: 54,
            y: 69
        }, {
            x: 34,
            y: 80
        }, {
            x: 12,
            y: 69
        });

        var mapColor = new MapColor();
        mapColor.red = 40;
        mapColor.green = 88;
        mapColor.blue = 48;

        this.addProperty(mapColor);
        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.Tree, app.Entity);

});