BASE.require([
    "Array.prototype.orderBy"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    app.systems.FreeCameraSystem = function (canvas, camera, scale) {
        var self = this;

        scale = scale || { x: 1, y: 1 };

        this.isReady = true;
        this.enabled = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageMap = {};
        this.game = null;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
        this.staticCache = document.createElement("canvas");
        this.camera = camera;
        this.cameraPosition = camera.getProperty("position");
        this.cameraMovement = camera.getProperty("movement");
        this.cameraSize = camera.getProperty("size");
        this.positionConstraint = camera.getProperty("position-constraint");
        this.position = {
            x: 0,
            y: 0
        };
        this.offScreenCanvas.width = canvas.width;
        this.offScreenCanvas.height = canvas.height;

        this.isMouseDown = false;
        this.mouseStartPosition = {
            x: 0,
            y: 0
        };
        this.canvasStartPosition = {
            x: 0,
            y: 0
        };

        var mousemove = function (event) {
            if (self.enabled) {
                self.position.x = self.canvasStartPosition.x + ((self.mouseStartPosition.x - event.pageX) / scale.x);
                self.position.y = self.canvasStartPosition.y + ((self.mouseStartPosition.y - event.pageY) / scale.y);
            }
        };

        var mouseup = function (event) {
            canvas.removeEventListener("mousemove", mousemove);
        };

        canvas.addEventListener("mousedown", function (event) {
            self.mouseStartPosition.x = event.pageX;
            self.mouseStartPosition.y = event.pageY;
            self.canvasStartPosition.x = self.position.x;
            self.canvasStartPosition.y = self.position.y;

            canvas.addEventListener("mousemove", mousemove);
        });

        canvas.addEventListener("mouseup", mouseup);
        canvas.addEventListener("mouseout", mouseup);
    };

    app.systems.FreeCameraSystem.prototype.positionCamera = function () {
        var cameraSize = this.cameraSize;
        var cameraMovement = this.cameraMovement;
        var positionConstraint = this.positionConstraint;

        cameraMovement.position.x = this.position.x;
        cameraMovement.position.y = this.position.y;

        if (cameraMovement.position.x + cameraSize.width > positionConstraint.position.x + positionConstraint.size.width) {
            cameraMovement.position.x = positionConstraint.position.x + positionConstraint.size.width - cameraSize.width;
        }

        if (cameraMovement.position.y + cameraSize.height > positionConstraint.position.y + positionConstraint.size.height) {
            cameraMovement.position.y = positionConstraint.position.y + positionConstraint.size.height - cameraSize.height;
        }

        if (cameraMovement.position.x < positionConstraint.position.x) {
            cameraMovement.position.x = positionConstraint.position.x;
        }

        if (cameraMovement.position.y < positionConstraint.position.y) {
            cameraMovement.position.y = positionConstraint.position.y
        }
    };

    app.systems.FreeCameraSystem.prototype.loadImage = function (path, callback) {
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

    app.systems.FreeCameraSystem.prototype.drawEntity = function (entity) {
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

    app.systems.FreeCameraSystem.prototype.activated = function (game) {
        this.game = game;
    };

    app.systems.FreeCameraSystem.prototype.update = function () {
        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var context = this.context;

        this.cameraSize.width = this.canvas.width;
        this.cameraSize.height = this.canvas.height;

        this.positionCamera();
        this.offScreenContext.clearRect(0, 0, cameraSize.width, cameraSize.height);

        var activeCollisions = camera.getProperty("collision").activeCollisions;
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

    app.systems.FreeCameraSystem.prototype.deactivated = function () {

    };


});