BASE.require([
    "app.entities.Player",
    "app.entities.Tree",
    "app.entities.BlueHouse",
    "app.entities.WitchHut",
], function () {
    BASE.namespace("app.systems");

    app.systems.BrushSystem = function (canvas, camera, scale) {
        var self = this;

        this.game = null;
        this.isReady = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.camera = camera;
        this.cameraPosition = camera.getProperty("position");
        this.currentBrushName = null;
        this.brushEntity = null;
        this.lastCursorPosition = {
            x: 0,
            y: 0
        };

        this.scale = scale || {
            x: 1,
            y: 1
        };

        this.entities = {
            tree: {
                displayName: "Tree",
                Type: app.entities.Tree
            },
            "blue-house": {
                displayName: "Blue House",
                Type: app.entities.BlueHouse
            },
            "witch-hut": {
                displayName: "Witch Hut",
                Type: app.entities.WitchHut
            },
        };

        canvas.addEventListener("mousemove", function (event) {

            if (self.game != null && self.brushEntity != null) {
                var size = self.brushEntity.getProperty("size");

                self.lastCursorPosition.x = Math.floor(((event.pageX - canvas.getBoundingClientRect().left) / self.scale.x) + self.cameraPosition.x - (size.width / 2));
                self.lastCursorPosition.y = Math.floor(((event.pageY - canvas.getBoundingClientRect().top) / self.scale.y) + self.cameraPosition.y - (size.height / 2));


                var position = self.brushEntity.getProperty("position");

                position.x = self.lastCursorPosition.x;
                position.y = self.lastCursorPosition.y;
            }
        });

        canvas.addEventListener("mouseout", function () {
            if (self.game != null && self.brushEntity != null) {
                var position = self.brushEntity.getProperty("position");

                position.x = -10000;
                position.y = -10000;
            }
        });

        canvas.addEventListener("mousedown", function () {
            if (self.game != null && self.brushEntity != null) {
                var oldEntity = self.brushEntity;
                var oldEntityImageTexture = oldEntity.getProperty("image-texture");
                oldEntityImageTexture.opacity = 1;

                var entity = self.createEntityByName(self.currentBrushName);
                var position = entity.getProperty("position");

                position.x = self.lastCursorPosition.x;
                position.y = self.lastCursorPosition.y;

                self.game.stage.appendChild(entity);
                self.brushEntity = entity;
            }
        });
    };

    app.systems.BrushSystem.prototype.createEntityByName = function (name) {
        var entity = new this.entities[name].Type();
        var entityImageTexture = entity.getProperty("image-texture");
        entityImageTexture.opacity = 0.4;

        return entity;
    };

    app.systems.BrushSystem.prototype.selectBrushByName = function (name) {
        this.clearBrush();

        if (this.entities[name]) {
            this.currentBrushName = name;
            var entity = this.createEntityByName(name);
            var position = entity.getProperty("position");

            position.x = this.lastCursorPosition.x;
            position.y = this.lastCursorPosition.y;

            this.brushEntity = entity;
            this.game.stage.appendChild(entity);
        }

    };

    app.systems.BrushSystem.prototype.clearBrush = function () {
        if (this.brushEntity != null) {
            this.brushEntity.parent.removeChild(this.brushEntity);
            this.brushEntity = null;
            this.currentBrushName = null;
        }
    };

    app.systems.BrushSystem.prototype.selectEraser = function (name) {
        this.clearBrush();
    };

    app.systems.BrushSystem.prototype.selectSelector = function (name) {

    };

    app.systems.BrushSystem.prototype.update = function () {

    };

    app.systems.BrushSystem.prototype.entityAdded = function (game) {

    };

    app.systems.BrushSystem.prototype.entityRemoved = function (game) {

    };

    app.systems.BrushSystem.prototype.activated = function (game) {
        this.game = game;
    };

    app.systems.BrushSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };
});