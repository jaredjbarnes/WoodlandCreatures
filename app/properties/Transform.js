BASE.require([
    "app.Rect"
], function () {

    BASE.namespace("app.properties");

    app.properties.Transform = function () {
        app.Rect.call(this);
    };

    BASE.extend(app.properties.Transform, app.Rect);

});

