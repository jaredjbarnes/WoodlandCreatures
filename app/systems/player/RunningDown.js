BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningDown = function () {
        this["@class"] = "app.systems.player.RunningDown";
        this.type = "state";
        this.name = "runningDown";
    };

    app.systems.player.RunningDown.prototype.initialize = function (game) {
    };

    app.systems.player.RunningDown.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingDown");
    };

    app.systems.player.RunningDown.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 25,
            x: 200
        }, {
            y: 25,
            x: 225
        }, {
            y: 25,
            x: 250
        }, {
            y: 25,
            x: 275
        }, {
            y: 25,
            x: 300
        }, {
            y: 25,
            x: 325
        }, {
            y: 25,
            x: 350
        }, {
            y: 25,
            x: 375
        }];
    };

    app.systems.player.RunningDown.prototype.deactivated = function (entity) {

    };


});