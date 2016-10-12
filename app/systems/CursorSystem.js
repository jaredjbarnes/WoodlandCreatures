BASE.require([
    "app.CanvasScaler",
    "app.systems.cursorModes.Brush",
    "app.systems.cursorModes.Eraser",
    "app.systems.cursorModes.Selection"
], function () {
    BASE.namespace("app.systems");

    var Selection = app.systems.cursorModes.Selection;
    var Brush = app.systems.cursorModes.Brush;
    var Eraser = app.systems.cursorModes.Eraser;

    var invokeMethod = function (obj, methodName, args) {
        args = args || [];
        if (obj != null && typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    app.systems.CursorSystem = function (canvas, camera, cellSize) {
        var self = this;

        this.game = null;
        this.isReady = true;
        this.canvas = canvas;
        this.cellSize = cellSize || 15;
        this.context = canvas.getContext("2d");
        this.camera = camera;
        this.cameraPosition = camera.getProperty("position");
        this.canvasScaler = new app.CanvasScaler(canvas);
        this.scale = this.canvasScaler.scale;
        this.currentMode = null;

        canvas.addEventListener("mousemove", function (event) {
            invokeMethod(self.currentMode, "mousemove", [event]);
        });

        canvas.addEventListener("mouseout", function (event) {
            invokeMethod(self.currentMode, "mouseout", [event]);
        });

        canvas.addEventListener("mouseup", function (event) {
            invokeMethod(self.currentMode, "mouseup", [event]);
        });

        canvas.addEventListener("mousedown", function (event) {
            invokeMethod(self.currentMode, "mousedown", [event]);
        });

    };

    app.systems.CursorSystem.prototype.changeMode = function (name) {
        var lastMode = this.currentMode;

        this.currentMode = this.modes[name] || null;
        invokeMethod(lastMode, "deactivated", []);
        invokeMethod(this.currentMode, "activated", []);
    };

    app.systems.CursorSystem.prototype.update = function () {
        invokeMethod(this.currentMode, "update", []);
    };

    app.systems.CursorSystem.prototype.entityAdded = function (game) {

    };

    app.systems.CursorSystem.prototype.entityRemoved = function (game) {

    };

    app.systems.CursorSystem.prototype.activated = function (game) {
        this.game = game;

        this.modes = {
            "selection": new Selection(this),
            "brush": new Brush(this),
            "eraser": new Eraser(this)
        }
    };

    app.systems.CursorSystem.prototype.deactivated = function () {
        this.game = null;
    };
});