﻿BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.Color = function () {
        this["@class"] = "app.properties.Color";
        this.type = "color";
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.alpha = 0;
    };

});



