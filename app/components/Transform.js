BASE.require([
    "app.Rect"
], function () {

    BASE.namespace("app.components");

    app.components.Transform = function () {
        app.Rect.call(this);
    };

    BASE.extend(app.components.Transform, app.Rect);

});

