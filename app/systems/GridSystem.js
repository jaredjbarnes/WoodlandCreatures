BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collision = app.properties.Collidable;

    app.systems.GridSystem = function (canvas, camera) {
        var self = this;
        this.isReady = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.camera = camera;
        this.game = null;
        this.cellSize = 15;
        this.offset = camera.getProperty("position");
        this.cameraSize = camera.getProperty("size");
    };

    app.systems.GridSystem.prototype.activated = function (game) {
        this.game = game;
    };

    app.systems.GridSystem.prototype.drawVerticalLineAt = function (number) {
        var context = this.context;
        number += 0.5;

        context.beginPath();
        context.lineCap = "square";
        context.lineWidth = 1;
        context.strokeStyle = "rgba(255, 255, 255, 0.2)"
        context.moveTo(number, 0);
        context.lineTo(number, this.cameraSize.height);
        context.stroke();
    };

    app.systems.GridSystem.prototype.drawHorizontalLineAt = function (number) {
        var context = this.context;
        number += 0.5;

        context.beginPath();
        context.lineCap = "square";
        context.lineWidth = 1;
        context.strokeStyle = "rgba(255, 255, 255, 0.2)"
        context.moveTo(0, number);
        context.lineTo(this.cameraSize.width, number);
        context.stroke();
    };

    app.systems.GridSystem.prototype.update = function () {
        var offsetX = this.cellSize - (this.offset.x % this.cellSize);
        var offsetY = this.cellSize - (this.offset.y % this.cellSize);
        var width = this.cameraSize.width;
        var height = this.cameraSize.height;
        var cellSize = this.cellSize;

        for (var x = offsetX ; x < width; x += cellSize) {
            this.drawVerticalLineAt(x);
        }

        for (var y = offsetY; y < height; y += cellSize) {
            this.drawHorizontalLineAt(y);
        }

    };

    app.systems.GridSystem.prototype.deactivated = function () {

    };

});