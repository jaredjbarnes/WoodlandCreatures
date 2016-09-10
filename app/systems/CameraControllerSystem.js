﻿BASE.require([], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var invokeMethod = function (obj, methodName, args) {
        if (obj && typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    app.systems.CameraControllerSystem = function (canvas) {
        var self = this;
        this.isReady = true;
        this.game = null;
        this.cameraController = null;

        this.isCamera = function (entity) {
            var cameraProperties = entity.properties["camera"];
            var transform = entity.properties["transform"];
            var cameraController = entity.properties["camera-controller"];

            return cameraProperties && transform && cameraController && cameraController[0];
        };
    };

    app.systems.CameraControllerSystem.prototype.findCamera = function (rootEntity) {
        var self = this;
        var camera = rootEntity.filter(function (entity) {
            self.entityAdded(entity);
        })[0];
    };

    // System specific methods.
    app.systems.CameraControllerSystem.prototype.entityAdded = function (entity) {
        if (this.isCamera(entity)) {
            this.cameraController = entity.components["camera-controller"] && entity.components["camera-controller"][0];
            invokeMethod(this.cameraController, "activated", [entity, this.game]);
        }
    };

    app.systems.CameraControllerSystem.prototype.entityRemoved = function (entity) {
        if (this.isCamera(entity)) {
            this.cameraController = null;
            invokeMethod(this.cameraController, "deactivated", []);
        }
    };

    app.systems.CameraControllerSystem.prototype.activated = function (game) {
        this.game = game;
        this.findCamera(game.rootEntity);
    };

    app.systems.CameraControllerSystem.prototype.update = function () {
        var cameraController = this.cameraController;
        invokeMethod(this.cameraController, "update", []);
    };

    app.systems.CameraControllerSystem.prototype.deactivated = function () {

    };


});