BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.components.CanvasImage");

    app.components.CanvasImage = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var canvas = tags["canvas"];
        var context = canvas.getContext("2d");
        var $canvas = $(tags["canvas"]);
        var sourceWidth = $elem.attr("source-width");
        var sourceHeight = $elem.attr("source-height");
        var sourceX = $elem.attr("source-x");
        var sourceY = $elem.attr("source-y");
        var sourcePath = $elem.attr("source-path");
        var image = new Image();

        image.onload = function () {
            context.drawImage(image,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                sourceWidth,
                sourceHeight);
        };

        image.src = sourcePath;

        canvas.width = parseInt(sourceWidth, 10);
        canvas.height = parseInt(sourceHeight, 10);

    };

});