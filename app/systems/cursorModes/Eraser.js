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

    app.systems.cursorModes.Eraser = function (cursorSystem) {
        this.isMouseDown = false;
        this.cursorSystem = cursorSystem;
        this.game = cursorSystem.game;
        this.scale = cursorSystem.scale;
        this.camera = cursorSystem.camera;
        this.canvas = cursorSystem.canvas;
        this.cameraPosition = cursorSystem.cameraPosition;
        this.context = cursorSystem.context;
        this.cursorEntity = new Entity();
        this.cursorPosition = new Position();
        this.cursorSize = new Size();
        this.cursorCollidable = new Collidable();
        this.activeCollisionSelections = [];
        this.canvasScaler = cursorSystem.canvasScaler;

        this.cursorEntity.type = "eraser-cursor";
        this.cursorEntity.addProperty(this.cursorPosition);
        this.cursorEntity.addProperty(this.cursorSize);
        this.cursorEntity.addProperty(this.cursorCollidable);

        this.cursorPosition.x = -1000000;
        this.cursorPosition.y = -1000000;

        this.cursorSize.width = 1;
        this.cursorSize.height = 1;

        this.cursorSystem.game.stage.appendChild(this.cursorEntity);
    };

    app.systems.cursorModes.Eraser.prototype.drawBorderAroundCollision = function (collision) {
        var entity = collision.entity;
        var context = this.context;
        var offset = this.cameraPosition;

        var position = entity.getProperty("position");
        var size = entity.getProperty("size");
        context.beginPath();
        context.lineWidth = 1;
        context.lineCap = "round";
        context.strokeStyle = '#0094ff';
        context.rect(position.x - offset.x, position.y - offset.y, size.width, size.height);
        context.stroke();
    };

    app.systems.cursorModes.Eraser.prototype.drawFillAroundCollision = function (collision) {
        var entity = collision.entity;
        var context = this.context;
        var offset = this.cameraPosition;

        var position = entity.getProperty("position");
        var size = entity.getProperty("size");
        context.beginPath();
        context.fillStyle = "rgba(0,148,255,0.3)";
        context.rect(position.x - offset.x, position.y - offset.y, size.width, size.height);
        context.fill();
        context.lineWidth = 1;
        context.lineCap = "round";
        context.strokeStyle = '#0094ff';
        context.stroke();
    };

    app.systems.cursorModes.Eraser.prototype.activated = function () {

    };

    app.systems.cursorModes.Eraser.prototype.deactivated = function () {

    };

    app.systems.cursorModes.Eraser.prototype.update = function () {
        var self = this;
        var activeCollisions = this.cursorCollidable.activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        }).filter(function (collision) {
            return collision.entity.type !== "camera" && collision.endTimestamp == null;
        });

        this.activeCollisionSelections = collisions;

        collisions.forEach(function (collision) {
            self.drawBorderAroundCollision(collision);
        });
    };

    app.systems.cursorModes.Eraser.prototype.erase = function () {
        this.activeCollisionSelections.forEach(function (collision) {
            var entity = collision.entity;
            var parent = entity.parent;

            if (parent != null) {
                collision.entity.parent.removeChild(entity);
            }
        });
    };

    app.systems.cursorModes.Eraser.prototype.mousedown = function (event) {
        if (this.game != null) {
            this.isMouseDown = true;
            this.erase();
        }
    };

    app.systems.cursorModes.Eraser.prototype.mousemove = function (event) {
        var canvas = this.canvas;
        var cameraPosition = this.cameraPosition;
        var cursorPosition = this.cursorPosition;
        var scale = this.scale;

        if (this.game != null) {
            cursorPosition.x = ((event.pageX - canvas.getBoundingClientRect().left) / scale.x) + cameraPosition.x;
            cursorPosition.y = ((event.pageY - canvas.getBoundingClientRect().top) / scale.y) + cameraPosition.y;
        }

        if (this.isMouseDown) {
            this.erase();
        }
    };

    app.systems.cursorModes.Eraser.prototype.mouseup = function (event) {
        this.isMouseDown = false;
    };

    app.systems.cursorModes.Eraser.prototype.mouseout = function (event) {
        var cursorPosition = this.cursorPosition;
        this.isMouseDown = false;

        if (this.game != null) {
            cursorPosition.x = -10;
            cursorPosition.y = -10;
        }
    };

});