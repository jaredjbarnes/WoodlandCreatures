﻿BASE.require([
    "app.Entity",
    "app.entities.Player",
    "app.entities.Tree",
    "app.entities.BlueHouse",
    "app.entities.WitchHut"
], function () {

    BASE.namespace("app.systems.cursorModes");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collidable = app.properties.Collidable;

    app.systems.cursorModes.Brush = function (cursorSystem) {
        this.isMouseDown = false;
        this.cursorSystem = cursorSystem;
        this.game = cursorSystem.game;
        this.scale = cursorSystem.scale;
        this.camera = cursorSystem.camera;
        this.canvas = cursorSystem.canvas;
        this.cameraPosition = cursorSystem.cameraPosition;
        this.context = cursorSystem.context;
        this.canvasScaler = cursorSystem.canvasScaler;
        this.brushEntity = null;
        this.cellSize = cursorSystem.cellSize;

        this.lastCursorPosition = {
            x: 0,
            y: 0
        };

        this.entities = {
            tree: {
                displayName: "Tree",
                Type: app.entities.Tree,
                category: "Plants"
            },
            "blue-house": {
                displayName: "Blue House",
                Type: app.entities.BlueHouse,
                category: "Structures"
            },
            "witch-hut": {
                displayName: "Witch Hut",
                Type: app.entities.WitchHut,
                category: "Structures"
            }
        };
    };

    app.systems.cursorModes.Brush.prototype.selectBrushByName = function (name) {

        if (this.entities[name]) {
            this.clearBrush();

            this.currentBrushName = name;
            var entity = this.createBrushByName(name);
            var position = entity.getProperty("position");

            position.x = this.lastCursorPosition.x;
            position.y = this.lastCursorPosition.y;

            this.brushEntity = entity;
            this.game.stage.appendChild(entity);
        }

    };

    app.systems.cursorModes.Brush.prototype.clearBrush = function () {
        if (this.brushEntity != null) {
            this.brushEntity.parent.removeChild(this.brushEntity);
            this.brushEntity = null;
            this.currentBrushName = null;
        }
    };

    app.systems.cursorModes.Brush.prototype.createBrushByName = function (name) {
        var entity = new this.entities[name].Type();
        var entityImageTexture = entity.getProperty("image-texture");
        var collidable = entity.getProperty("collidable");
        var position = entity.getProperty("position");

        entityImageTexture.opacity = 0.4;
        position.isStatic = false;

        if (collidable != null) {
            collidable.isStatic = false;
        }

        return entity;
    };

    app.systems.cursorModes.Brush.prototype.createEntityByName = function (name) {
        var entity = new this.entities[name].Type();
        return entity;
    };

    app.systems.cursorModes.Brush.prototype.drawBrush = function () {
        if (this.game != null && this.brushEntity != null && !this.brushEntityHasCollision()) {
            this.canvasScaler.scaleCanvas();

            var entity = this.createEntityByName(this.currentBrushName);
            var position = entity.getProperty("position");

            position.x = this.lastCursorPosition.x;
            position.y = this.lastCursorPosition.y;

            this.game.stage.appendChild(entity);
        }
    };

    app.systems.cursorModes.Brush.prototype.brushEntityHasCollision = function () {
        var rigidBody = this.brushEntity.getProperty("rigid-body");
        var brushPosition = this.brushEntity.getProperty("position");

        if (rigidBody != null) {
            return Object.keys(rigidBody.activeCollisions).filter(function (key) {
                var collision = rigidBody.activeCollisions[key];
                var entity = collision.entity;
                var position = entity.getProperty("position");

                return position.x === brushPosition.x && position.y === brushPosition.y

            }).length > 0;
        }

        return false
    };


    app.systems.cursorModes.Brush.prototype.activated = function () {

    };

    app.systems.cursorModes.Brush.prototype.deactivated = function () {

    };

    app.systems.cursorModes.Brush.prototype.update = function () {

    };

    app.systems.cursorModes.Brush.prototype.mousedown = function (event) {
        this.isMouseDown = true;
        this.drawBrush();
    };

    app.systems.cursorModes.Brush.prototype.mousemove = function (event) {
        var canvas = this.canvas;

        if (this.game != null && this.brushEntity != null) {
            var size = this.brushEntity.getProperty("size");
            var lastX = Math.floor(((event.pageX - canvas.getBoundingClientRect().left) / this.scale.x) + this.cameraPosition.x - (size.width / 2));
            var lastY = Math.floor(((event.pageY - canvas.getBoundingClientRect().top) / this.scale.y) + this.cameraPosition.y - (size.height / 2));

            this.lastCursorPosition.x = Math.floor(lastX / this.cellSize) * this.cellSize;
            this.lastCursorPosition.y = Math.floor(lastY / this.cellSize) * this.cellSize;

            var position = this.brushEntity.getProperty("position");

            position.x = this.lastCursorPosition.x
            position.y = this.lastCursorPosition.y;

            if (this.isMouseDown) {
                this.drawBrush();
            }
        }
    };

    app.systems.cursorModes.Brush.prototype.mouseup = function (event) {
        this.isMouseDown = false;
    };

    app.systems.cursorModes.Brush.prototype.mouseout = function (event) {
        if (this.game != null && this.brushEntity != null) {
            var position = this.brushEntity.getProperty("position");

            position.x = -10000;
            position.y = -10000;
        }

        this.isMouseDown = false;
    };

});