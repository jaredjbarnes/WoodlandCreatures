BASE.require([
], function () {
    BASE.namespace("app.properties");

    app.properties.ImageTexture = function () {
        this.type = "image-texture";
        this.path = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.offset = {
            x: 0,
            y: 0
        };
    };

});



