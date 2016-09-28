BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.StandingDown = function () {
        this["@class"] = "app.systems.player.StandingDown";
        this.type = "state";
        this.name = "standingDown";
    };

    app.systems.player.StandingDown.prototype.initialize = function (entity) {
    };

    app.systems.player.StandingDown.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingDown");
    };

    app.systems.player.StandingDown.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 50,
            x: 25
        }];
    };

    app.systems.player.StandingDown.prototype.deactivated = function () {

    };


});