BASE.require([
    "app.components.Transform"
], function () {
    BASE.namespace("app.components");

    var Transform = app.components.Transform;

    app.components.Renderable = function () {
        Transform.call(this);
        this.path = null;
    };

    BASE.extend(app.components.Renderable, Transform);
});



