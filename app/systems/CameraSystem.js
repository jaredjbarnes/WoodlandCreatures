BASE.require([
    "Array.prototype.orderBy"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    app.systems.CameraSystem = function (canvas, camera) {
        var self = this;
        this.isReady = true;
        this.enabled = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageMap = {};
        this.game = null;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
        this.staticCache = document.createElement("canvas");
        this.offScreenCanvas.width = canvas.width;
        this.offScreenCanvas.height = canvas.height;

        this.position = {
            x: 0,
            y: 0
        };

    };

    app.systems.CameraSystem.prototype.setCamera = function (camera) {
        this.camera = camera;

        if (!camera.hasProperties(["position", "size", "collidable"])) {
            throw new Error("A camera needs to have a position, size and collision property.");
        }

        this.cameraPosition = camera.getProperty("position");
        this.cameraSize = camera.getProperty("size");

    };

    app.systems.CameraSystem.prototype.loadImage = function (path, callback) {
        callback = callback || emptyFn;
        var image = new Image();
        var camera = this;

        if (camera.imageMap[path] != null) {
            callback();
            return;
        }

        camera.imageMap[path] = image;
        image.onload = callback;
        image.src = path;
    };

    app.systems.CameraSystem.prototype.drawEntity = function (entity) {
        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var size = entity.getProperty("size");
        var position = entity.getProperty("position");
        var imageTexture = entity.getProperty("image-texture");
        var imageMap = this.imageMap;
        var offScreenContext = this.offScreenContext;

        if (size == null || position == null || imageTexture == null) {
            return;
        }

        var image = imageMap[imageTexture.path];
        if (image == null) {
            this.loadImage(imageTexture.path);
            return;
        }

        offScreenContext.drawImage(
            image,
            imageTexture.x,
            imageTexture.y,
            imageTexture.width,
            imageTexture.height,
            Math.floor(position.x - cameraPosition.x + imageTexture.offset.x),
            Math.floor(position.y - cameraPosition.y + imageTexture.offset.y),
            imageTexture.width,
            imageTexture.height
            );
    };

    app.systems.CameraSystem.prototype.activated = function (game) {
        this.game = game;
    };

    app.systems.CameraSystem.prototype.update = function () {
        if (this.camera == null) {
            return;
        }

        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var context = this.context;

        this.cameraSize.width = this.canvas.width;
        this.cameraSize.height = this.canvas.height;

        if (typeof this.positionCamera === "function") {
            this.positionCamera();
        }

        this.offScreenContext.clearRect(0, 0, cameraSize.width, cameraSize.height);

        var activeCollisions = camera.getProperty("collidable").activeCollisions;
        var keys = Object.keys(activeCollisions);
        var length = keys.length;
        var entities = [];

        for (var x = 0 ; x < length ; x++) {
            entities.push(activeCollisions[keys[x]].entity);
        }

        entities.orderBy(function (entity) {
            var size = entity.getProperty("size");
            var position = entity.getProperty("position");

            return position.y + size.height;
        });

        for (var x = 0 ; x < entities.length ; x++) {
            this.drawEntity(entities[x]);
        }

        context.clearRect(0, 0, cameraSize.width, cameraSize.height);
        context.drawImage(this.offScreenCanvas, 0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height);
    };

});