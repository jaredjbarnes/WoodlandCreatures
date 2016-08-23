BASE.require([
    "app.components.Rect"
], function () {
    BASE.namespace("app.components");

    var Rect = app.components.Rect;

    app.components.Image = function () {
        Rect.call(this);
        this.path = null;
    };

    BASE.extend(app.components.Image, Rect);
});



