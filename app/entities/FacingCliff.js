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

    app.entities.FacingCliff = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.FacingCliff";
        this.type = "facing-cliff";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 526;
        image.position.y = 136;
        image.size.width = 64;
        image.size.height = 45;

        var size = new Size();
        size.width = 64;
        size.height = 45;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 1
        }, {
            x: 64,
            y: 1
        }, {
            x: 64,
            y: 45
        }, {
            x: 0,
            y: 45
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.FacingCliff, app.Entity);

});