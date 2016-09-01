BASE.require([
    "app.Entity",
    "app.components.Transform",
    "app.components.Renderable",
    "app.components.Sprite",
    "app.components.PlayerState"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.components.Transform;
    var Sprite = app.components.Sprite;
    var PlayerState = app.components.PlayerState;

    // TODO: Put the current weapon as a child entity. And when striking, the state will show the child graphic.

    app.entities.Player = function () {
        app.Entity.call(this);

        this.type = "Player";

        var image = new app.components.Renderable();
        image.path = "/images/link.gif";
        image.x = 0;
        image.y = 0;
        image.width = 23;
        image.height = 25;

        var rect = new Transform();
        rect.x = 10;
        rect.y = 10;
        rect.width = 23;
        rect.height = 25;

        var sprite = new Sprite();
        sprite.timeScale = .35;

        var playerState = new PlayerState();

        this.components.push(image, rect, sprite, playerState);
    };

    BASE.extend(app.entities.Player, app.Entity);

});