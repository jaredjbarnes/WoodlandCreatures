BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.StandingRight = function () {
        this["@class"] = "app.components.player.states.StandingRight";
        this.type = "state";
        this.name = "standingRight";
        this.entity = null;
    };

    app.components.player.states.StandingRight.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.StandingRight.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingRight");
    };

    app.components.player.states.StandingRight.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 0,
            x: 200
        }];
    };

    app.components.player.states.StandingRight.prototype.deactivated = function () {

    };


});