BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app");

    app.CanvasScaler = function (canvas, threshold) {
        this.canvas = canvas;
        this.threshold = threshold || 400;
        this.scale = {
            x: 1,
            y: 1
        };
    };

    app.CanvasScaler.prototype.getDimension = function (width, height) {
        var ratio;
        var threshold = this.threshold;

        if (width > height) {
            ratio = width / height;
            return {
                width: threshold,
                height: threshold / ratio
            };
        } else {
            ratio = height / width;
            return {
                width: threshold / ratio,
                height: threshold
            }
        }
    };

    app.CanvasScaler.prototype.scaleCanvas = function () {
        var canvas = this.canvas;

        var width = $(canvas).width();
        var height = $(canvas).height();
        var dimension = this.getDimension(width, height);

        this.scale.x = width / dimension.width;
        this.scale.y = height / dimension.height;

        canvas.width = dimension.width;
        canvas.height = dimension.height;
    };

});