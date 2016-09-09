﻿BASE.require([], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    app.systems.CameraSystem = function (canvas) {
        var self = this;

        this.isReady = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageMap = {};

        // This is how the camera system knows what to render.
        // It finds the entity with a camera on it named the 
        // same as this property.
        this.cameraName = null;
        this.cameraProperty = null;
        this.cameraCollisionHandler = null;

        this.isCamera = function (entity) {
            var cameraProperties = entity.properties["camera"];
            var transform = entity.properties["transform"];
            var cameraCollisionHandler = entity.components["collision-handler"];

            return cameraProperties &&
                transform[0] &&
                cameraProperties[0] &&
                cameraProperties[0].name === self.cameraName &&
                cameraCollisionHandler && cameraCollisionHandler[0] && cameraCollisionHandler[0]["@class"] === "app.components.CameraCollisionHandler";
        };
    };

    app.systems.CameraSystem.prototype.loadImage = function (path, callback) {
        callback = callback || emptyFn;
        var image = new Image(path);
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
        var camera = this.cameraProperty;
        var transform = entity.properties["transform"][0];
        var imageTexture = entity.properties["image-texture"][0];
        var imageMap = this.imageMap;
        var image = imageMap[imageTexture.path];
        var context = this.context;

        if (transform == null || imageTexture == null) {
            return;
        }

        if (image == null) {
            this.loadImage(imageTexture.path);
            return;
        }

        context.drawImage(
            image,
            imageTexture.x,
            imageTexture.y,
            imageTexture.width,
            imageTexture.height,
            transform.x - camera.x,
            transform.y - camera.y,
            transform.width,
            transform.height
            );
    };

    app.systems.CameraSystem.prototype.findCamera = function (rootEntity) {
        var self = this;
        var camera = rootEntity.filter(function (entity) {
            self.entityAdded(entity);
        })[0];
    };

    // System specific methods.
    app.systems.CameraSystem.prototype.entityAdded = function (entity) {
        if (this.cameraProperty == null && this.isCamera(entity)) {
            this.cameraProperty = entity.properties["transform"][0];
            this.cameraCollisionHandler = entity.components["collision-handler"][0];
            this.canvas.width = this.cameraProperty.width;
            this.canvas.height = this.cameraProperty.height;
        }
    };

    app.systems.CameraSystem.prototype.entityRemoved = function (entity) {
        if (this.cameraProperty != null && this.isCamera(entity)) {
            this.cameraProperty = null;
            this.cameraCollisionHandler = null;
        }
    };

    app.systems.CameraSystem.prototype.activated = function (game) {
        this.findCamera(game.rootEntity);
    };

    app.systems.CameraSystem.prototype.update = function () {
        var cameraCollisionHandler = this.cameraCollisionHandler;
        var camera = this.cameraProperty;
        var context = this.context;

        if (cameraCollisionHandler != null) {
            context.clearRect(0, 0, camera.width, camera.height);

            var entities = cameraCollisionHandler.intersectingEntitiesById;
            var keys = Object.keys(entities);
            var length = keys.length;

            for (var x = 0 ; x < length ; x++) {
                this.drawEntity(entities[keys[x]])
            }
        }
    };

    app.systems.CameraSystem.prototype.deactivated = function () {

    };


});