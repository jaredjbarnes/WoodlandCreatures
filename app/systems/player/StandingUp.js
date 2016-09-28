BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.StandingUp = function () {
        this["@class"] = "app.systems.player.StandingUp";
        this.type = "state";
        this.name = "standingUp";
    };

    app.systems.player.StandingUp.prototype.initialize = function (game) {
    };

    app.systems.player.StandingUp.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingUp");
    };

    app.systems.player.StandingUp.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 50,
            x: 0
        }];
    };

    app.systems.player.StandingUp.prototype.deactivated = function (entity) {

    };


});