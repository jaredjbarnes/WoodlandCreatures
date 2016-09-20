﻿BASE.require([
    "Array.prototype.orderBy"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var invokeMethod = function (obj, methodName, args) {
        if (obj && typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    app.systems.CameraSystem = function (canvas) {
        var self = this;

        this.isReady = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageMap = {};
        this.game = null;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
        this.staticCache = document.createElement("canvas");

        // This is how the camera system knows what to render.
        // It finds the entity with a camera on it named the 
        // same as this property.
        this.cameraName = null;
        this.cameraTranform = null;
        this.camera = null;
        this.cameraCollisionHandler = null;
        this.cameraController = null;

        this.isCamera = function (entity) {
            var cameraCollisionHandler = entity.getComponent("collision-handler");
            return entity.hasProperties(["camera", "size", "position"]) && cameraCollisionHandler["@class"] === "app.components.CameraCollisionHandler";
        };
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
        var image = imageMap[imageTexture.path];
        var offScreenContext = this.offScreenContext;

        if (size == null || position == null || imageTexture == null) {
            return;
        }

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
            position.x - cameraPosition.x + imageTexture.offset.x,
            position.y - cameraPosition.y + imageTexture.offset.y,
            imageTexture.width,
            imageTexture.height
            );
    };

    app.systems.CameraSystem.prototype.findCamera = function (stage) {
        var self = this;
        var camera = stage.filter(function (entity) {
            self.entityAdded(entity);
        })[0];
    };




    // System specific methods.
    app.systems.CameraSystem.prototype.entityAdded = function (entity) {
        if (this.cameraPosition == null && this.cameraSize == null && this.isCamera(entity)) {
            this.cameraPosition = entity.getProperty("position");
            this.cameraSize = entity.getProperty("size");
            this.camera = entity.getProperty("camera");
            this.cameraCollisionHandler = entity.getComponent("collision-handler");
            this.cameraController = entity.getComponent("camera-controller");

            this.cameraSize.width = this.canvas.width;
            this.cameraSize.height = this.canvas.height;
            this.offScreenCanvas.width = this.canvas.width;
            this.offScreenCanvas.height = this.canvas.height;

            invokeMethod(this.cameraController, "activated", [entity, this.game]);
        }
    };

    app.systems.CameraSystem.prototype.entityRemoved = function (entity) {
        if (this.cameraSize != null && this.cameraPosition != null && this.isCamera(entity)) {
            this.camera = null;
            this.cameraSize = null;
            this.cameraPosition = null;
            this.cameraCollisionHandler = null;
            this.cameraController = null;

            invokeMethod(this.cameraController, "deactivated", []);
        }
    };

    app.systems.CameraSystem.prototype.activated = function (game) {
        this.game = game;
        this.findCamera(game.stage);
    };

    app.systems.CameraSystem.prototype.update = function () {
        var cameraCollisionHandler = this.cameraCollisionHandler;
        var cameraController = this.cameraController;
        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var offScreenContext = this.offScreenContext;
        var context = this.context;

        if (cameraCollisionHandler != null) {
            invokeMethod(this.cameraController, "update", []);

            offScreenContext.clearRect(0, 0, cameraSize.width, cameraSize.height);

            var entitiesById = cameraCollisionHandler.intersectingEntitiesById;
            var keys = Object.keys(entitiesById);
            var length = keys.length;
            var entities = [];

            for (var x = 0 ; x < length ; x++) {
                entities.push(entitiesById[keys[x]]);
            }

            entities.orderBy(function (entity) {
                var size = entity.getProperty("size");
                var position = entity.getProperty("position");

                return position.y + size.height;
            });

            for (var x = 0 ; x < entities.length ; x++) {
                this.drawEntity(entities[x]);
            }

            context.clearRect(0,0, cameraSize.width, cameraSize.height );
            context.drawImage(this.offScreenCanvas, 0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height);
        }
    };

    app.systems.CameraSystem.prototype.deactivated = function () {

    };


});