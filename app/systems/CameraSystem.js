﻿BASE.require([
    "Array.prototype.orderBy"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };

    var sortEntities = function (entityA, entityB) {
        var sizeA = entityA.properties.size[0];
        var positionA = entityA.properties.position[0];
        var groundA = entityA.properties.ground;

        var sizeB = entityB.properties.size[0];
        var positionB = entityB.properties.position[0];
        var groundB = entityA.properties.ground;

        var adjustedA = {
            x: positionA.x + (sizeA.width / 2),
            y: positionA.y + (sizeA.height / 2)
        };

        var adjustedB = {
            x: positionB.x + (sizeB.width / 2),
            y: positionB.y + (sizeB.height / 2)
        };

        if (groundA != null && groundB == null) {
            return -1
        }

        if (groundA == null && groundB != null) {
            return 1;
        }

        if (adjustedA.y === adjustedB.y) {

            if (adjustedA.x === adjustedB.x) {
                if (entityA.type > entityB.type) {
                    return 1;
                } else {
                    return -1
                }
            } else if (adjustedA.x > adjustedB.x) {
                return 1;
            } else {
                return -1;
            }

        } else if (adjustedA.y > adjustedB.y) {
            return 1;
        } else {
            return -1
        }
    };

    app.systems.CameraSystem = function (canvas, camera) {
        var self = this;
        this.isReady = true;
        this.enabled = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.imageMap = {};
        this.groundEntities = [];
        this.staticEntities = [];
        this.game = null;
        this.cameraPosition = null;
        this.cameraSize = null;
        this.cameraCollidable = null;
        this.offScreenCanvas = document.createElement("canvas");
        this.offScreenContext = this.offScreenCanvas.getContext("2d");
        this.staticCache = document.createElement("canvas");
        this.offScreenCanvas.width = canvas.width;
        this.offScreenCanvas.height = canvas.height;
        this.stageSize = null;

        this.position = {
            x: 0,
            y: 0
        };

        this.setCamera(camera);

        this.groundCanvas = document.createElement("canvas");
        this.groundContext = this.groundCanvas.getContext("2d");
        this.staticCanvas = document.createElement("canvas");
        this.staticContext = this.staticCanvas.getContext("2d");
    };

    app.systems.CameraSystem.prototype.setCamera = function (camera) {
        this.camera = camera;

        if (!camera.hasProperties(["position", "size", "collidable"])) {
            throw new Error("A camera needs to have a position, size and collision property.");
        }

        this.cameraPosition = camera.getProperty("position");
        this.cameraSize = camera.getProperty("size");
        this.cameraCollidable = camera.getProperty("collidable");

    };

    app.systems.CameraSystem.prototype.cacheGround = function () {
        var self = this;
        var groundCanvas = this.groundCanvas;
        var groundContext = this.groundContext;
        var groundEntities = this.groundEntities;
        var stageSize = this.game.stage.getProperty("size");

        groundCanvas.width = stageSize.width;
        groundCanvas.height = stageSize.height;

        groundEntities.sort(sortEntities);

        groundEntities.forEach(function (entity) {
            self.drawEntity(entity, groundContext);
        });

    };

    app.systems.CameraSystem.prototype.cacheStatic = function () {
        var self = this;
        var staticCanvas = this.staticCanvas;
        var staticContext = this.staticContext;
        var staticEntities = this.staticEntities;
        var stageSize = this.game.stage.getProperty("size");

        staticCanvas.width = stageSize.width;
        staticCanvas.height = stageSize.height;

        staticEntities.sort(sortEntities);

        staticEntities.forEach(function (entity) {
            self.drawEntity(entity, staticContext);
        });
    };

    app.systems.CameraSystem.prototype.cacheCanvases = function () {
        var size = this.game.stage.getProperty("size");

        this.groundCanvas.width = size.width;
        this.groundCanvas.height = size.height;
        this.staticCanvas.width = size.width;
        this.staticCanvas.height = size.height;

        this.cacheGround();
        this.cacheStatic();
    };

    app.systems.CameraSystem.prototype.addGroundEntity = function (entity) {
        if (entity.hasProperties(["ground", "image-texture"])) {
            this.groundEntities.push(entity);
        }
    };

    app.systems.CameraSystem.prototype.addStaticEntity = function (entity) {
        if (entity.hasProperties(["position", "size", "image-texture"]) &&
            !entity.hasProperties(["ground"]) &&
            entity.getProperty("position").isStatic) {
            this.staticEntities.push(entity);
        }
    };

    app.systems.CameraSystem.prototype.entityAdded = function (entity) {
        this.addGroundEntity(entity);
        this.addStaticEntity(entity);

        this.redrawCachedEntitiesOnCamera();
    };

    app.systems.CameraSystem.prototype.entityRemoved = function (entity) {
        var index = this.groundEntities.indexOf(entity);
        if (index > -1) {
            this.groundEntities.splice(index, 1);
            this.redrawCachedEntitiesOnCamera();
            return;
        }

        index = this.staticEntities.indexOf(entity);
        if (index > -1) {
            this.staticEntities.splice(index, 1);
            this.redrawCachedEntitiesOnCamera();
            return;
        }

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

    app.systems.CameraSystem.prototype.redrawCachedEntitiesOnCamera = function (entity, context) {
        var self = this;
        var camera = this.camera;
        var activeCollisions = camera.getProperty("collidable").activeCollisions;
        var position = camera.getProperty("position");
        var size = camera.getProperty("size");
        var groundContext = this.groundContext;
        var staticContext = this.staticContext;

        var entities = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key].entity;
        });

        entities.sort(sortEntities);

        groundContext.clearRect(position.x, position.y, size.width, size.height);
        staticContext.clearRect(position.x, position.y, size.width, size.height);

        entities.forEach(function (entity) {
            if (entity.parent == null) {
                return;
            }

            if (entity.hasProperties(["ground", "image-texture"])) {
                self.drawEntity(entity, groundContext);
            } else if (entity.hasProperties(["position", "size", "image-texture"]) && entity.getProperty("position").isStatic) {
                self.drawEntity(entity, staticContext);
            }
        });
    };

    app.systems.CameraSystem.prototype.drawEntityOnCamera = function (entity, context) {
        var self = this;
        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var size = entity.properties["size"][0];
        var position = entity.properties["position"][0];
        var collidable = entity.properties["collidable"][0];
        var activeCollisions = collidable.activeCollisions;
        var keys = Object.keys(activeCollisions);
        var imageTexture = entity.properties["image-texture"][0];
        var imageMap = this.imageMap;
        var context = this.offScreenContext;

        var entities = keys.filter(function (key) {
            var collision = activeCollisions[key];
            return collision.endTimestamp == null && collision.entity.parent != null;
        }).map(function (key) {
            return activeCollisions[key].entity;
        });

        entities.push(entity);
        entities.sort(sortEntities);

        entities.forEach(function (intersectingEntity) {
            if (!intersectingEntity.hasProperties(["image-texture"]) || intersectingEntity.hasProperties(["ground"])) {
                return;
            }

            var intersectingImageTexture = intersectingEntity.properties["image-texture"][0];
            var intersectingPosition = intersectingEntity.properties["position"][0];
            var intersectingSize = intersectingEntity.properties["size"][0];
            var image = imageMap[intersectingImageTexture.path];

            if (image == null) {
                self.loadImage(intersectingImageTexture.path, function () {
                    self.cacheCanvases();
                });
            } else {

                var left = Math.max(intersectingPosition.x, position.x);
                var top = Math.max(intersectingPosition.y, position.y);
                var right = Math.min(intersectingPosition.x + intersectingSize.width, position.x + size.width);
                var bottom = Math.min(intersectingPosition.y + intersectingSize.height, position.y + size.height);
                var width = Math.round(right - left);
                var height = Math.round(bottom - top);

                if (width <= 0 || height <= 0) {
                    return;
                }

                var x = position.x - intersectingPosition.x;
                var y = position.y - intersectingPosition.y;

                if (x < 0) {
                    x = 0;
                }

                if (y < 0) {
                    y = 0
                }

                context.globalAlpha = intersectingImageTexture.opacity;

                context.drawImage(
                    image,
                    Math.round(intersectingImageTexture.position.x + x),
                    Math.round(intersectingImageTexture.position.y + y),
                    width,
                    height,
                    Math.round(intersectingPosition.x - cameraPosition.x + intersectingImageTexture.offset.x + x),
                    Math.round(intersectingPosition.y - cameraPosition.y + intersectingImageTexture.offset.y + y),
                    width,
                    height
                    );
            }
        });

    };

    app.systems.CameraSystem.prototype.drawEntity = function (entity, context) {
        var self = this;
        var stageSize = this.stageSize;
        var size = entity.properties["size"][0];
        var position = entity.properties["position"][0];
        var imageTexture = entity.properties["image-texture"][0];
        var imageMap = this.imageMap;
        var image = imageMap[imageTexture.path];
        var x = position.x;
        var y = position.y;
        var sourcePositionX = imageTexture.position.x;
        var sourcePositionY = imageTexture.position.y;
        var width = imageTexture.size.width;
        var height = imageTexture.size.height;

        if (image == null) {
            this.loadImage(imageTexture.path, function () {
                self.cacheCanvases();
            });
        } else {
            if (x < 0) {
                width += x;
                sourcePositionX -= x;
                x = 0;
            }

            if (y < 0) {
                height += y;
                sourcePositionY -= y;
                y = 0;
            }

            context.globalAlpha = imageTexture.opacity;

            context.drawImage(
                image,
                Math.round(sourcePositionX),
                Math.round(sourcePositionY),
                width,
                height,
                Math.round(x),
                Math.round(y),
                width,
                height
                );
        }

    };

    app.systems.CameraSystem.prototype.activated = function (game) {
        var self = this;
        var stage = game.stage;
        var size = stage.getProperty("size");

        this.stageSize = size;
        this.game = game;

        this.groundCanvas.width = size.width;
        this.groundCanvas.height = size.height;
        this.staticCanvas.width = size.width;
        this.staticCanvas.height = size.height;

        stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.systems.CameraSystem.prototype.positionCamera = function () { };

    app.systems.CameraSystem.prototype.update = function () {
        var cameraSize = this.cameraSize;
        var cameraPosition = this.cameraPosition;
        var camera = this.camera;
        var context = this.context;
        var canvas = this.canvas;

        this.cameraSize.width = this.canvas.width;
        this.cameraSize.height = this.canvas.height;
        this.offScreenCanvas.width = this.canvas.width;
        this.offScreenCanvas.height = this.canvas.height;

        var activeCollisions = this.cameraCollidable.activeCollisions;
        var keys = Object.keys(activeCollisions);
        var length = keys.length;
        var entities = [];
        var entity;
        var ground;
        var position;
        var imageTextures;
        var clearCache = false;

        this.positionCamera();

        for (var x = 0 ; x < length; x++) {
            entity = activeCollisions[keys[x]].entity;

            if ((entity.parent &&
                entity.hasProperties(["image-texture"]) &&
                !entity.hasProperties(["ground"]) &&
                !entity.properties["position"][0].isStatic)) {
                entities.push(entity);
            }

            if ((entity.hasProperties(["image-texture"]) && entity.getProperty("image-texture").redraw)) {
                clearCache = true;
                entity.getProperty("image-texture").redraw = false;
            }
        }

        entities.sort(sortEntities);

        for (var x = 0 ; x < entities.length ; x++) {
            this.drawEntityOnCamera(entities[x], this.offScreenContext);
        }

        if (clearCache) {
            this.redrawCachedEntitiesOnCamera();
        }

        context.clearRect(0, 0, cameraSize.width, cameraSize.height);

        context.drawImage(this.groundCanvas,
            Math.round(cameraPosition.x),
            Math.round(cameraPosition.y),
            cameraSize.width,
            cameraSize.height,
            0,
            0,
            cameraSize.width,
            cameraSize.height);

        context.drawImage(this.staticCanvas,
            Math.round(cameraPosition.x),
            Math.round(cameraPosition.y),
            cameraSize.width,
            cameraSize.height,
            0,
            0,
            cameraSize.width,
            cameraSize.height);

        context.drawImage(this.offScreenCanvas,
            0,
            0,
            cameraSize.width,
            cameraSize.height);
    };

});