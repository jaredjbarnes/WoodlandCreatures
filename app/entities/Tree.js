BASE.require([
    "app.Entity",
    "app.properties.Transform",
    "app.properties.Collision",
    "app.properties.ImageTexture"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;
    var ImageTexture = app.properties.ImageTexture;

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
        image.offset = {
            x: -5,
            y: -20
        };

        var transform = new Transform();
        transform.x = 200;
        transform.y = 200;
        transform.width = 55;
        transform.height = 55;

        var collision = new Collision();
        collision.isStatic = true;
        collision.name = "prop";

        this.addProperty(image);
        this.addProperty(transform);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.Tree, app.Entity);

});