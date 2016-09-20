BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.TouchInput = function () {
        this["@class"] = "app.properties.TouchInput";
        this.type = "touch-input";
        this.x = 0;
        this.y= 0;
        this.isTouching = false;
    };

});



