BASE.require([], function () {
    BASE.namespace("app.properties");

    app.properties.Sprite = function () {
        this["@type"] = "app.properties.Sprite";
        this.type = "app.properties.Sprite";
        this.timeScale = 1;
        this.index = 0;
        this.positions = [];
    };

});