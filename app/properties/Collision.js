BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.Collision = function () {
        this["@type"] = "app.properties.Collision";
        this.type = "app.properties.Collision";
        this.isStatic = false;
        this.enabled = true;
    };

});