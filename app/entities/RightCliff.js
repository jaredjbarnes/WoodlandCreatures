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

    app.entities.RightCliff = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.RightCliff";
        this.type = "right-cliff";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 591;
        image.position.y = 104;
        image.size.width = 48;
        image.size.height = 80;

        var size = new Size();
        size.width = 48;
        size.height = 80;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 35
        }, {
            x: 33,
            y: 3
        }, {
            x: 30,
            y: 40
        }, {
            x: 0,
            y: 78
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.RightCliff, app.Entity);

});