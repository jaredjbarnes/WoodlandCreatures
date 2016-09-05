BASE.require([
    "app.Entity",
    "app.properties.Transform",
    "app.properties.ImageTexture",
    "app.properties.Sprite",
    "app.components.State"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.properties.Transform;
    var Sprite = app.properties.Sprite;
    var ImageTexture = app.properties.ImageTexture;
    var State = app.components.State;

    app.entities.Player = function () {
        app.Entity.call(this);

        this.type = "Player";

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

        var sprite = new Sprite();
        sprite.timeScale = .35;

        this.properties.push(image, transform, sprite);
    };

    BASE.extend(app.entities.Player, app.Entity);

});