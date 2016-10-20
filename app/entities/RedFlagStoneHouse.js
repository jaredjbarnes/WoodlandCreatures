BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;

    app.entities.RedFlagStoneHouse = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.RedFlagStoneHouse";
        this.type = "blue-house";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 177;
        image.position.y = 291;
        image.size.width = 96;
        image.size.height = 96;

        var size = new Size();
        size.width = 96;
        size.height = 96;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 30
        }, {
            x: 96,
            y: 30
        }, {
            x: 96,
            y: 85
        }, {
            x: 0,
            y: 85
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.RedFlagStoneHouse, app.Entity);

});