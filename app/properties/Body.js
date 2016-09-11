BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.Body = function () {
        this["@class"] = "app.properties.Body";
        this.type = "body";
        // Array of vertices.
        this.vertices = [];
    };

});