BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collision",
    "app.properties.ImageTexture",
    "app.properties.RigidBody"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collision;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;

    app.entities.Tree = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Tree";
        this.type = "tree";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.x = 50;
        image.y = 539;
        image.width = 65;
        image.height = 80;

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
        rigidBody.offset.x = 0;
        rigidBody.offset.y = 40;
        rigidBody.points.push({
            x: 0,
            y: 0
        }, {
            x: 65,
            y: 0
        }, {
            x: 65,
            y: 40
        }, {
            x: 0,
            y: 40
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.Tree, app.Entity);

});