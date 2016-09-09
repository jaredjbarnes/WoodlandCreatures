BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.RunningUp = function () {
        this["@class"] = "app.components.player.states.RunningUp";
        this.type = "state";
        this.name = "runningUp";
        this.entity = null;
    };

    app.components.player.states.RunningUp.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.RunningUp.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingUp");
    };

    app.components.player.states.RunningUp.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
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

    app.components.player.states.RunningUp.prototype.deactivated = function () {

    };


});