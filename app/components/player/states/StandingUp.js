BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.StandingUp = function () {
        this["@class"] = "app.components.player.states.StandingUp";
        this.type = "state";
        this.name = "standingUp";
        this.entity = null;
    };

    app.components.player.states.StandingUp.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.StandingUp.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingUp");
    };

    app.components.player.states.StandingUp.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 50,
            x: 0
        }];
    };

    app.components.player.states.StandingUp.prototype.deactivated = function () {

    };


});