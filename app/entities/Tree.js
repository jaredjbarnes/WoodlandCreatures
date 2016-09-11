BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collision",
    "app.properties.ImageTexture",
    "app.properties.RectangleBody"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collision;
    var ImageTexture = app.properties.ImageTexture;
    var RectangleBody = app.properties.RectangleBody;

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

        var collision = new Collision();
        collision.isStatic = true;
        collision.name = "prop";

        var rectangleBody = new RectangleBody();
        rectangleBody.size.width = 45;
        rectangleBody.size.height = 45;
        rectangleBody.position.y = 35;
        rectangleBody.position.x = 10;

        this.addProperty(rectangleBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.Tree, app.Entity);

});