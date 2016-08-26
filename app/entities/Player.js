BASE.require([
    "app.Entity",
    "app.components.Rect",
    "app.components.Renderable",
    "app.components.Sprite"
], function () {

    BASE.namespace("app.entities");

    var Rect = app.components.Rect;
    var Sprite = app.components.Sprite;

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

        var rect = new Rect();
        rect.x = 10;
        rect.y = 10;
        rect.width = 23;
        rect.height = 25;

        var sprite = new Sprite();
        sprite.positions = [{
            y: 9,
            x: 9
        }, {
            y: 9,
            x: 34
        }, {
            y: 9,
            x: 58
        }, {
            y: 9,
            x: 80
        }, {
            y: 9,
            x: 102
        }, {
            y: 9,
            x: 127
        }, {
            y: 9,
            x: 152
        }, {
            y: 9,
            x: 174
        }];

        sprite.timeScale = .35;

        this.components.push(image, rect, sprite);
    };

    BASE.extend(app.entities.Player, app.Entity);

});