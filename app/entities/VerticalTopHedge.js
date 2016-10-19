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

    app.entities.VerticalTopHedge = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.VerticalTopHedge";
        this.type = "vertical-top-hedge";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 463;
        image.position.y = 298;
        image.size.width = 16;
        image.size.height = 23;

        var size = new Size();
        size.width = 16;
        size.height = 23;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 7
        }, {
            x: 16,
            y: 7
        }, {
            x: 16,
            y: 16
        }, {
            x: 0,
            y: 16
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.VerticalTopHedge, app.Entity);

});