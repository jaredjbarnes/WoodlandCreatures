BASE.require([
    "app.Rect"
], function () {
    BASE.namespace("app.properties");

    var Rect = app.Rect;

    app.properties.Render = function () {
        Rect.call(this);
        this.path = null;
    };

    BASE.extend(app.properties.Render, Rect);
});



