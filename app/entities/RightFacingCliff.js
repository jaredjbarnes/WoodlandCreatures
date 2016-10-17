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

    app.entities.RightFacingCliff = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.RightFacingCliff";
        this.type = "right-facing-cliff";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 547;
        image.position.y = 60;
        image.size.width = 16;
        image.size.height = 64;

        var size = new Size();
        size.width = 16;
        size.height = 64;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x:0,
            y: 16
        }, {
            x: 16,
            y: 0
        }, {
            x: 16,
            y: 44
        }, {
            x: 0,
            y: 64
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.RightFacingCliff, app.Entity);

});