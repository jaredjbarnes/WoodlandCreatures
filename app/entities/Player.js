BASE.require([
    "app.Entity",
    "app.components.Rect",
    "app.components.Image",
    "app.components.Sprite"
], function () {

    BASE.namespace("app.entities");

    var Rect = app.components.Rect;
    var Image = app.components.Image;
    var Sprite = app.components.Sprite;

    app.entities.Player = function () {
        app.Entity.call(this);

        this.type = "Player";

        var image = new app.components.Image();
        image.path = "/images/zelda.gif";
        image.x = 0;
        image.y = 0;
        image.width = 23;
        image.height = 24;

        var rect = new Rect();
        rect.x = 10;
        rect.y = 10;
        rect.width = 23;
        rect.height = 24;

        var sprite = new Sprite();
        sprite.positions = [{
            y: 138,
            x: 85
        }, {
            y: 138,
            x: 109
        }, {
            y: 138,
            x: 133
        }, {
            y: 137,
            x: 15
        }, {
            y: 138,
            x: 38
        }, {
            y: 138,
            x: 61
        }];

        sprite.timeScale = .35;

        this.components.push(image, rect, sprite);
    };

    BASE.extend(app.entities.Player, app.Entity);

});