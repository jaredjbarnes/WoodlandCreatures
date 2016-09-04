BASE.require([
    "app.Rect"
], function () {
    BASE.namespace("app.properties");

    var Rect = app.Rect;

    app.properties.ImageTexture = function () {
        Rect.call(this);
        this.path = null;
    };

    BASE.extend(app.properties.ImageTexture, Rect);
});



