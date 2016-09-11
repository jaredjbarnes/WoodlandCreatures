BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.PositionConstraint = function () {
        this["@class"] = "app.properties.PositionConstraint";
        this.type = "position-constraint";
        this.byEntityId = null;

        this.size = {
            width: 0,
            height: 0
        };

        this.position = {
            x: 0,
            y: 0
        };
    };

});