BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.CanvasScaler"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collision = app.properties.Collidable;

    var emptyFn = function () { };

    app.systems.SelectionSystem = function (canvas, camera) {
        var self = this;

        this.canvasScaler = new app.CanvasScaler(canvas);

        this.scale = canvasScaler.scale;

        this.isReady = true;
        this.game = null;
        this.cursorEntity = null;
        this.cursorEntityPosition = null;
        this.cursorCollisionProperty = null;
        this.canvas = canvas;
        this.camera = camera;
        this.context = canvas.getContext("2d");
        this.selectedCollision = null;
        this.activeCollisionSelections = [];

        var cameraPosition = this.cameraPosition = camera.getProperty("position");

        canvas.addEventListener("mousemove", function (event) {
            if (self.game != null) {
                self.cursorEntityPosition.x = ((event.pageX - canvas.getBoundingClientRect().left) / self.scale.x) + cameraPosition.x;
                self.cursorEntityPosition.y = ((event.pageY - canvas.getBoundingClientRect().top) / self.scale.y) + cameraPosition.y;
            }
        });

        canvas.addEventListener("mouseout", function () {
            if (self.game != null) {
                self.cursorEntityPosition.x = -10;
                self.cursorEntityPosition.y = -10;
            }
        });

        canvas.addEventListener("mousedown", function () {
            if (self.game != null) {
                self.canvasScaler.scaleCanvas();
                self.selectedCollision = self.activeCollisionSelections[0];
            }
        });
    };

    app.systems.SelectionSystem.prototype.addCursorEntity = function () {
        var game = this.game;
        var entity = this.cursorEntity = new Entity();
        entity.type = "cursor";

        var size = new Size();
        size.width = 1;
        size.height = 1;

        var position = new Position();
        position.x = -10;
        position.y = -10;

        var collision = new Collision();

        entity.addProperty(position);
        entity.addProperty(size);
        entity.addProperty(collision);

        this.cursorCollisionProperty = collision;
        this.cursorEntityPosition = position;
        game.stage.appendChild(entity);
    };

    app.systems.SelectionSystem.prototype.activated = function (game) {
        this.game = game;
        this.addCursorEntity();
    };

    app.systems.SelectionSystem.prototype.drawBorderAroundCollision = function (collision) {
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

    app.systems.SelectionSystem.prototype.drawFillAroundCollision = function (collision) {
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

    app.systems.SelectionSystem.prototype.update = function () {
        var self = this;
        var activeCollisions = this.cursorCollisionProperty.activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        }).filter(function (collision) {
            return collision.entity.type !== "camera" && collision.endTimestamp == null;
        });

        this.activeCollisionSelections = collisions;

        if (collisions.length > 0) {
            self.drawBorderAroundCollision(collisions[0]);
        }

        if (this.selectedCollision != null) {
            this.drawFillAroundCollision(this.selectedCollision);
        }
    };

    app.systems.SelectionSystem.prototype.deactivated = function () {

    };

});