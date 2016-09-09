BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.StandingLeft = function () {
        this["@class"] = "app.components.player.states.StandingLeft";
        this.type = "state";
        this.name = "standingLeft";
        this.entity = null;
    };

    app.components.player.states.StandingLeft.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.StandingLeft.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingLeft");
    };

    app.components.player.states.StandingLeft.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 0,
            x: 0
        }];
    };

    app.components.player.states.StandingLeft.prototype.deactivated = function () {

    };


});