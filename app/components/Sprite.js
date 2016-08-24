BASE.require([], function () {
    BASE.namespace("app.components");

    app.components.Sprite = function () {
        this.timeScale = 1;
        this.index = 0;
        this.positions = [];
    };

});