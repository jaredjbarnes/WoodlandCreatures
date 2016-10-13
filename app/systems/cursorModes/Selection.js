BASE.require([
    "app.Entity",
    "app.properties.Collidable",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.KeyboardInput"
], function () {

    BASE.namespace("app.systems.cursorModes");

    var Entity = app.Entity;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Collidable = app.properties.Collidable;
    var KeyboardInput = app.properties.KeyboardInput;

    app.systems.cursorModes.Selection = function (cursorSystem) {
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
        this.keyboardInput = new KeyboardInput();
        this.selectedCollision = null;
        this.activeCollisionSelections = [];
        this.canvasScaler = cursorSystem.canvasScaler;
        this.cellSize = cursorSystem.cellSize;
        this.tick = 0;

        this.cursorEntity.type = "selection-cursor";
        this.cursorEntity.addProperty(this.cursorPosition);
        this.cursorEntity.addProperty(this.cursorSize);
        this.cursorEntity.addProperty(this.cursorCollidable);
        this.cursorEntity.addProperty(this.keyboardInput);

        this.cursorPosition.x = -1000000;
        this.cursorPosition.y = -1000000;

        this.cursorSize.width = 1;
        this.cursorSize.height = 1;

        this.startCursorPosition = {
            x: 0,
            y: 0
        };

        this.startSelectedEntityPosition = {
            x: 0,
            y: 0
        };

        this.cursorSystem.game.stage.appendChild(this.cursorEntity);
    };

    app.systems.cursorModes.Selection.prototype.drawBorderAroundCollision = function (collision) {
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

    app.systems.cursorModes.Selection.prototype.drawFillAroundCollision = function (collision) {
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

    app.systems.cursorModes.Selection.prototype.activated = function () {

    };

    app.systems.cursorModes.Selection.prototype.deactivated = function () {

    };

    app.systems.cursorModes.Selection.prototype.update = function () {
        var activeCollisions = this.cursorCollidable.activeCollisions;
        var collisions = Object.keys(activeCollisions).map(function (key) {
            return activeCollisions[key];
        }).filter(function (collision) {
            return collision.entity.type !== "camera" && collision.endTimestamp == null;
        });

        this.activeCollisionSelections = collisions;

        if (collisions.length > 0) {
            this.drawBorderAroundCollision(collisions[0]);
        }

        if (this.selectedCollision != null) {
            this.drawFillAroundCollision(this.selectedCollision);

            if (this.tick % 5 === 0) {

                var entity = this.selectedCollision.entity;
                var position = entity.getProperty("position");

                if (this.keyboardInput.pressedKeys["38"]) {
                    position.y -= this.cellSize;
                }

                if (this.keyboardInput.pressedKeys["40"]) {
                    position.y += this.cellSize;
                }

                if (this.keyboardInput.pressedKeys["37"]) {
                    position.x -= this.cellSize;
                }

                if (this.keyboardInput.pressedKeys["39"]) {
                    position.x += this.cellSize;
                }
            }

        }

        this.tick++;
    };

    app.systems.cursorModes.Selection.prototype.mousedown = function (event) {
        this.tick = 0;
        if (this.game != null) {
            this.isMouseDown = true;
            this.startCursorPosition.x = this.cursorPosition.x;
            this.startCursorPosition.y = this.cursorPosition.y;

            this.selectedCollision = this.activeCollisionSelections[0] || null;

            if (this.selectedCollision != null) {
                var position = this.selectedCollision.entity.getProperty("position");
                this.startSelectedEntityPosition.x = position.x;
                this.startSelectedEntityPosition.y = position.y;
            }
        }
    };

    app.systems.cursorModes.Selection.prototype.mousemove = function (event) {
        var canvas = this.canvas;
        var cameraPosition = this.cameraPosition;
        var cursorPosition = this.cursorPosition;
        var startCursorPosition = this.startCursorPosition;
        var scale = this.scale;

        if (this.game != null) {
            cursorPosition.x = ((event.pageX - canvas.getBoundingClientRect().left) / scale.x) + cameraPosition.x;
            cursorPosition.y = ((event.pageY - canvas.getBoundingClientRect().top) / scale.y) + cameraPosition.y;
        }

        if (this.isMouseDown && this.selectedCollision) {
            var differenceX = cursorPosition.x - startCursorPosition.x;
            var differenceY = cursorPosition.y - startCursorPosition.y;

            var position = this.selectedCollision.entity.getProperty("position");
            position.x = Math.floor((this.startSelectedEntityPosition.x + differenceX) / this.cellSize) * this.cellSize;
            position.y = Math.floor((this.startSelectedEntityPosition.y + differenceY) / this.cellSize) * this.cellSize;
        }
    };

    app.systems.cursorModes.Selection.prototype.mouseup = function (event) {
        this.isMouseDown = false;
    };

    app.systems.cursorModes.Selection.prototype.mouseout = function (event) {
        if (this.game != null) {
            this.isMouseDown = false;

            var cursorPosition = this.cursorPosition;

            cursorPosition.x = -10;
            cursorPosition.y = -10;
        }
    };

});