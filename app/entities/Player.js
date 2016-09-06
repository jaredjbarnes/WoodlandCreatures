BASE.require([
    "app.Entity",
    "app.properties.Transform",
    "app.properties.Collision",
    "app.properties.ImageTexture",
    "app.properties.Sprite"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;
    var Sprite = app.properties.Sprite;
    var ImageTexture = app.properties.ImageTexture;

    app.entities.Player = function () {
        app.Entity.call(this);

        this["@type"] = "app.entities.Player";
        this.type = "app.entities.Player";

        var image = new app.properties.ImageTexture();
        image.path = "/images/link.gif";
        image.x = 0;
        image.y = 0;
        image.width = 25;
        image.height = 25;

        var transform = new Transform();
        transform.x = 10;
        transform.y = 10;
        transform.width = 25;
        transform.height = 25;

        var collision = new Collision();

        var sprite = new Sprite();
        sprite.timeScale = .35;

        this.addProperty(image);
        this.addProperty(transform);
        this.addProperty(sprite);
        this.addProperty(collision);
    };

    BASE.extend(app.entities.Player, app.Entity);

});