BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningUp = function () {
        this["@class"] = "app.systems.player.RunningUp";
        this.type = "state";
        this.name = "runningUp";
    };

    app.systems.player.RunningUp.prototype.initialize = function (entity) {
    };

    app.systems.player.RunningUp.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingUp");
    };

    app.systems.player.RunningUp.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 25,
            x: 0
        }, {
            y: 25,
            x: 25
        }, {
            y: 25,
            x: 50
        }, {
            y: 25,
            x: 75
        }, {
            y: 25,
            x: 100
        }, {
            y: 25,
            x: 125
        }, {
            y: 25,
            x: 150
        }, {
            y: 25,
            x: 175
        }];
    };

    app.systems.player.RunningUp.prototype.deactivated = function () {

    };


});