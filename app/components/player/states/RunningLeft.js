BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.RunningLeft = function () {
        this["@class"] = "app.components.player.states.RunningLeft";
        this.type = "state";
        this.name = "runningLeft";
        this.entity = null;
    };

    app.components.player.states.RunningLeft.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.RunningLeft.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingLeft");
    };

    app.components.player.states.RunningLeft.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
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

    app.components.player.states.RunningLeft.prototype.deactivated = function () {

    };


});