BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collision",
    "app.properties.Movement"
], function () {

    BASE.namespace("app.systems");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collision = app.properties.Collision;
    var Movement = app.properties.Movement;

    var emptyFn = function () { };

    app.systems.SelectionSystem = function (canvas, camera, scale) {
        var self = this;

        this.scale = scale || {
            x: 1,
            y: 1
        };

        this.isReady = true;
        this.game = null;
        this.cursorEntity = null;
        this.cursorEntityPosition = null;
        this.cursorCollisionProperty = null;
        this.canvas = canvas;
        this.camera = camera;
        this.context = canvas.getContext("2d");

        var cameraPosition = this.cameraPosition = camera.getProperty("position");

        canvas.addEventListener("mousemove", function (event) {
            self.cursorEntityPosition.x = ((event.pageX - canvas.getBoundingClientRect().left) / self.scale.x) + cameraPosition.x;
            self.cursorEntityPosition.y = ((event.pageY - canvas.getBoundingClientRect().top) / self.scale.y) + cameraPosition.y;
        });

        canvas.addEventListener("mouseout", function () {
            self.cursorEntityPosition.x = -10;
            self.cursorEntityPosition.y = -10;
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

        var movement = new Movement();

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

    app.systems.SelectionSystem.prototype.update = function () {
        var activeCollisions = this.cursorCollisionProperty.activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        });
        var context = this.context;
        var cameraPosition = this.cameraPosition;
        var offset = cameraPosition;

        if (collisions.length > 0) {
            collisions.forEach(function (collision) {
                var entity = collision.entity;

                if (entity.type !== "camera" && collision.endTimestamp == null) {
                    var position = entity.getProperty("position");
                    var size = entity.getProperty("size");
                    context.beginPath();
                    context.lineWidth = 3;
                    context.lineCap = "round";
                    context.strokeStyle = '#0094ff';
                    context.rect(position.x - offset.x, position.y - offset.y, size.width, size.height);
                    context.stroke();
                }
            });
        }
    };

    app.systems.SelectionSystem.prototype.deactivated = function () {

    };

});