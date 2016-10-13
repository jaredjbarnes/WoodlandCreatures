BASE.require([

], function () {
    BASE.namespace("app.systems");

    app.systems.MapSystem = function (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.game = null;
        this.entities = [];
    };

    app.sysems.activated = function (game) {
        var self = this;

        this.game = game;
        this.game.stage.filter(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.sysems.entityAdded = function (entity) {
        if (entity.hasProperties(["map-color"])) {
            this.entities.push(entity);
        }
    };

    app.sysems.entityRemoved = function (entity) {
        if (entity.hasProperties(["map-color"])) {
            var index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };


});