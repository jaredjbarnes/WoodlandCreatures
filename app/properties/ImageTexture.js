BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.ImageTexture = function () {
        this.type = "image-texture";
        this.path = null;
        this.opacity = 1;
        this.position = {
            x: 0,
            y: 0
        };
        this.size = {
            width: 0,
            height: 0
        };
        this.offset = {
            x: 0,
            y: 0
        };
        this.redraw = false;
    };

});



