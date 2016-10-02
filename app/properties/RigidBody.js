BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.RigidBody = function () {
        this["@class"] = "app.properties.RigidBody";
        this.type = "rigid-body";
        
        this.offset = {
            x: 0,
            y: 0
        };

        this.points = [];
        this.vertices = [];
        this.normals = [];
    };

});