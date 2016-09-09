BASE.require([
    "app.components.player.states.handleStateChangeByInput"
], function () {

    BASE.namespace("app.components.player.states");

    var handleStateChangeByInput = app.components.player.states.handleStateChangeByInput;

    app.components.player.states.RunningRight = function () {
        this["@class"] = "app.components.player.states.RunningRight";
        this.type = "state";
        this.name = "runningRight";
        this.entity = null;
    };

    app.components.player.states.RunningRight.prototype.initialize = function (entity) {
        this.entity = entity;
    };

    app.components.player.states.RunningRight.prototype.update = function () {
        handleStateChangeByInput(this.entity, "standingRight");
    };

    app.components.player.states.RunningRight.prototype.activated = function () {
        var sprite = this.entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.positions = [{
            y: 0,
            x: 200
        }, {
            y: 0,
            x: 225
        }, {
            y: 0,
            x: 250
        }, {
            y: 0,
            x: 275
        }, {
            y: 0,
            x: 300
        }, {
            y: 0,
            x: 325
        }, {
            y: 0,
            x: 350
        }, {
            y: 0,
            x: 375
        }];
    };

    app.components.player.states.RunningRight.prototype.deactivated = function () {

    };


});