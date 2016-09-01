BASE.require([
    "app.components.Transform",
    "app.Vector"
], function () {

    BASE.namespace("app.components");

    var Vector = app.Vector;

    app.components.Collidable = function () {
        this.enabled = true;
        this.polygons = [];
    };
    
});