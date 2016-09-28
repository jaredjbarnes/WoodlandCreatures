BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningLeft = function () {
        this["@class"] = "app.systems.player.RunningLeft";
        this.type = "state";
        this.name = "runningLeft";
    };

    app.systems.player.RunningLeft.prototype.initialize = function (game) {
    };

    app.systems.player.RunningLeft.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingLeft");
    };

    app.systems.player.RunningLeft.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 0,
            x: 0
        }, {
            y: 0,
            x: 25
        }, {
            y: 0,
            x: 50
        }, {
            y: 0,
            x: 75
        }, {
            y: 0,
            x: 100
        }, {
            y: 0,
            x: 125
        }, {
            y: 0,
            x: 150
        }, {
            y: 0,
            x: 175
        }];
    };

    app.systems.player.RunningLeft.prototype.deactivated = function () {

    };


});