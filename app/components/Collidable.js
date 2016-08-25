BASE.require([
    "app.components.Rect"
], function () {

    BASE.namespace("app.components");

    app.components.Collidable = function () {
        this.enabled = true;
        this.isStatic = false;
        this.points = [];
    };

    // Metadata for development environment.
    app.components.Collidable.dependencies = [app.components.Rect];
    app.components.Collidable.namespace = "app.components.Collidable";

});