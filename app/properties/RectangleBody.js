BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.RectangleBody = function () {
        this["@class"] = "app.properties.RectangleBody";
        this.type = "rectangle-body";
        
        this.offset = {
            x: 0,
            y: 0
        };

        this.size = {
            width: 0,
            height: 0
        };
    };

});