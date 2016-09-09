BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.StandingDown = function () {
        this["@class"] = "app.components.player.states.StandingDown";
        this.type = "state";
        this.name = "standingDown";
        this.entity = null;
    };

    app.components.player.states.StandingDown.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.StandingDown.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingDown");
    };

    app.components.player.states.StandingDown.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 50,
            x: 25
        }];
    };

    app.components.player.states.StandingDown.prototype.deactivated = function () {

    };


});