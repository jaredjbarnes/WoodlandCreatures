BASE.require([
    "app.Entity",
    "app.systems.cursorModes.brushes"
], function () {

    BASE.namespace("app.systems.cursorModes");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collidable = app.properties.Collidable;
    var brushes = app.systems.cursorModes.brushes;

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
        this.currentBrushName = null;

        this.lastCursorPosition = {
            x: 0,
            y: 0
        };

        this.entities = brushes;
        this.entitiesByName = brushes.reduce(function (accumulator, brush) {
            accumulator[brush.name] = brush;
            return accumulator;
        }, {});
    };

    app.systems.cursorModes.Brush.prototype.selectBrushByName = function (name) {

        if (this.entitiesByName[name]) {
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
        var entity = new this.entitiesByName[name].Type();
        var entityImageTexture = entity.getProperty("image-texture");
        var collidable = entity.getProperty("collidable");
        var position = entity.getProperty("position");

        entity.removeProperty(entity.getProperty("ground"));

        entityImageTexture.opacity = 0.4;
        position.isStatic = false;

        if (collidable != null) {
            collidable.isStatic = false;
        }

        return entity;
    };

    app.systems.cursorModes.Brush.prototype.createEntityByName = function (name) {
        var entity = new this.entitiesByName[name].Type();
        return entity;
    };

    app.systems.cursorModes.Brush.prototype.drawBrush = function () {
        if (this.game != null &&
            this.brushEntity != null &&
            !this.brushEntityHasCollision()) {

            var entity = this.createEntityByName(this.currentBrushName);
            var position = entity.getProperty("position");

            position.x = this.lastCursorPosition.x;
            position.y = this.lastCursorPosition.y;

            this.game.stage.appendChild(entity);
        }
    };

    app.systems.cursorModes.Brush.prototype.brushEntityHasCollision = function () {
        var collidable = this.brushEntity.getProperty("collidable");
        var brushPosition = this.brushEntity.getProperty("position");
        var brushEntity = this.brushEntity;

        if (collidable != null) {
            return Object.keys(collidable.activeCollisions).filter(function (key) {
                var collision = collidable.activeCollisions[key];
                var entity = collision.entity;
                var position = entity.getProperty("position");

                return brushEntity.type == entity.type && position.x === brushPosition.x && position.y === brushPosition.y;

            }).length > 0;
        }

        return false
    };


    app.systems.cursorModes.Brush.prototype.activated = function () {

    };

    app.systems.cursorModes.Brush.prototype.deactivated = function () {
        this.clearBrush();
    };

    app.systems.cursorModes.Brush.prototype.update = function () {
        if (this.isMouseDown) {
            this.cursorSystem.cameraSystem.redrawCachedEntitiesOnCamera();
        }
    };

    app.systems.cursorModes.Brush.prototype.mousedown = function (event) {
        this.isMouseDown = true;
        this.drawBrush();
    };

    app.systems.cursorModes.Brush.prototype.mousemove = function (event) {
        var canvas = this.canvas;

        if (this.game != null && this.brushEntity != null) {
            var size = this.brushEntity.getProperty("size");
            var lastX = ((event.pageX - canvas.getBoundingClientRect().left) / this.scale.x) + this.cameraPosition.x - (size.width / 2);
            var lastY = ((event.pageY - canvas.getBoundingClientRect().top) / this.scale.y) + this.cameraPosition.y - (size.height / 2);

            this.lastCursorPosition.x = Math.floor(Math.round(lastX / this.cellSize) * this.cellSize);
            this.lastCursorPosition.y = Math.floor(Math.round(lastY / this.cellSize) * this.cellSize);

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