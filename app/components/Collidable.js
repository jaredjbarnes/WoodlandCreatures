BASE.require([
    "app.components.Rect",
    "app.Vector"
], function () {

    BASE.namespace("app.components");

    var Vector = app.Vector;

    app.components.Collidable = function () {
        this.enabled = true;
        this.polygons = [];
        this.normals = [];
    };

});