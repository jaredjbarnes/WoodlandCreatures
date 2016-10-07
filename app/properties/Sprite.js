BASE.require([], function () {
    BASE.namespace("app.properties");

    app.properties.Sprite = function () {
        this["@class"] = "app.properties.Sprite";
        this.type = "sprite";
        this.timeScale = 1;
        this.index = 0;
        this.images = [];
    };

});