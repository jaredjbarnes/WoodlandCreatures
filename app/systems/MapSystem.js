BASE.require([
    "Array.prototype.indexOfByFunction"
], function () {
    BASE.namespace("app.systems");

    var MapEntity = function () {
        this.id = null;
        this.size = null;
        this.position = null;
        this.color = null;
        this.border = null;
    };

    app.systems.MapSystem = function (canvas, stage, threshold) {
        threshold = threshold || 300;
        this.isReady = true;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.game = null;
        this.entities = [];
        this.tick = 0;

        var stageSize = this.stageSize = stage.getProperty("size");

        if (stageSize.width > stageSize.height) {
            canvas.width = threshold;
            canvas.height = stageSize.height / stageSize.width * threshold;
        } else {
            canvas.height = threshold;
            canvas.width = stageSize.width / stageSize.height * threshold;
        }

        this.scale = canvas.width / this.stageSize.width;
    };

    app.systems.MapSystem.prototype.activated = function (game) {
        var self = this;

        this.game = game;
        this.game.stage.filter(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.systems.MapSystem.prototype.drawMapEntity = function (mapEntity) {
        var context = this.context;
        var scale = this.scale;
        var color = mapEntity.color;
        var borderColor = mapEntity.border.color;
        var thickness = mapEntity.border.thickness;
        var position = mapEntity.position;
        var size = mapEntity.size;
        var x = position.x * scale;
        var y = position.y * scale;
        var width = size.width * scale;
        var height = size.height * scale;

        context.beginPath();

        if (thickness > 0 && borderColor.alpha > 0) {
            context.lineWidth = thickness;
            context.strokeStyle = "rgba(" + borderColor.red + "," + borderColor.green + "," + borderColor.blue + "," + borderColor.alpha + ")";
            context.strokeRect(x, y, width, height);
        }

        if (color.alpha > 0){
            context.fillStyle = "rgba(" + color.red + "," + color.green + "," + color.blue + "," + color.alpha + ")";
            context.fillRect(x, y, width, height);
        }
        
        context.closePath();
    };

    app.systems.MapSystem.prototype.draw = function () {
        var context = this.context;
        var entities = this.entities;
        var length = entities.length;

        this.scale = this.canvas.width / this.stageSize.width;

        this.context.beginPath();
        this.context.fillStyle = "#489848";
        this.context.fillRect(0, 0, this.stageSize.width * this.scale, this.stageSize.height * this.scale);
        this.context.closePath();

        for (var x = 0 ; x < length; x++) {
            this.drawMapEntity(entities[x]);
        }
    };

    app.systems.MapSystem.prototype.update = function () {
        this.tick++;
        if (this.tick % 10 === 0) {
            this.draw();
        }
    };

    app.systems.MapSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["mapable", "size", "position"])) {
            var mapable = entity.getProperty("mapable");

            var mapEntity = new MapEntity();
            mapEntity.id = entity.id;
            mapEntity.size = entity.getProperty("size");
            mapEntity.position = entity.getProperty("position");
            mapEntity.color = mapable.color;
            mapEntity.border = mapable.border;

            this.entities.push(mapEntity);
        }
    };

    app.systems.MapSystem.prototype.entityRemoved = function (entity) {
        if (entity.hasProperties(["mapable", "size", "position"])) {

            var index = this.entities.indexOfByFunction(function (mapEntity) {
                return mapEntity.id === entity.id;
            });

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };


});