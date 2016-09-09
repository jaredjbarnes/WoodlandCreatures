BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.RunningDown = function () {
        this["@class"] = "app.components.player.states.RunningDown";
        this.type = "state";
        this.name = "runningDown";
        this.entity = null;
    };

    app.components.player.states.RunningDown.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.RunningDown.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingDown");
    };

    app.components.player.states.RunningDown.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 25,
            x: 200
        }, {
            y: 25,
            x: 225
        }, {
            y: 25,
            x: 250
        }, {
            y: 25,
            x: 275
        }, {
            y: 25,
            x: 300
        }, {
            y: 25,
            x: 325
        }, {
            y: 25,
            x: 350
        }, {
            y: 25,
            x: 375
        }];
    };

    app.components.player.states.RunningDown.prototype.deactivated = function () {

    };


});