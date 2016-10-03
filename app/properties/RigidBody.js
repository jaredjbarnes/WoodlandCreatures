BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.RigidBody = function () {
        this["@class"] = "app.properties.RigidBody";
        this.type = "rigid-body";
        this.name = "default";

        this.offset = {
            x: 0,
            y: 0
        };

        this.points = [];

        this.vertices = [];

        this.projectionVertices = [];

        this.normals = [];

        this.size = {
            width: 0,
            height: 0
        };

        this.origin = {
            x: 0,
            y: 0
        };

        this.activeCollisionsByNames = {};
    };

});