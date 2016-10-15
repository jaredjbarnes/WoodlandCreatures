BASE.require([
    "app.Entity",
    "app.properties.Collidable",
    "app.properties.Size",
    "app.properties.Position"
], function () {

    BASE.namespace("app.systems.cursorModes");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collidable = app.properties.Collidable;

    app.systems.cursorModes.Pan = function (cursorSystem) {
        this.isMouseDown = false;
        this.cursorSystem = cursorSystem;
        this.game = cursorSystem.game;
        this.scale = cursorSystem.scale;
        this.camera = cursorSystem.camera;
        this.canvas = cursorSystem.canvas;
        this.cameraPosition = cursorSystem.cameraPosition;
        this.context = cursorSystem.context;
        this.canvasScaler = cursorSystem.canvasScaler;
        this.mouseStartPosition = {
            x: 0,
            y: 0
        };
        this.canvasStartPosition = {
            x: 0,
            y: 0
        };
    };

    app.systems.cursorModes.Pan.prototype.activated = function () {

    };

    app.systems.cursorModes.Pan.prototype.deactivated = function () {

    };

    app.systems.cursorModes.Pan.prototype.update = function () {

    };

    app.systems.cursorModes.Pan.prototype.mousedown = function (event) {
        if (this.game != null) {
            this.isMouseDown = true;
            this.mouseStartPosition.x = event.pageX;
            this.mouseStartPosition.y = event.pageY;
            this.canvasStartPosition.x = this.cameraPosition.x;
            this.canvasStartPosition.y = this.cameraPosition.y;
        }
    };

    app.systems.cursorModes.Pan.prototype.mousemove = function (event) {
        if (this.isMouseDown) {
            var scale = this.canvasScaler.scale;
            this.cameraPosition.x = Math.floor(this.canvasStartPosition.x + ((this.mouseStartPosition.x - event.pageX) / scale.x));
            this.cameraPosition.y = Math.floor(this.canvasStartPosition.y + ((this.mouseStartPosition.y - event.pageY) / scale.y));
        }
    };

    app.systems.cursorModes.Pan.prototype.mouseup = function (event) {
        this.isMouseDown = false;
    };

    app.systems.cursorModes.Pan.prototype.mouseout = function (event) {
        this.isMouseDown = false;
    };

});