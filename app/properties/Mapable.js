BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.Mapable = function () {
        this["@class"] = "app.properties.Mapable";
        this.type = "mapable";
        this.color = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        };
        this.border = {
            color: {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0
            },
            thickness: 0
        }
    };

});



