BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningRight = function () {
        this["@class"] = "app.systems.player.RunningRight";
        this.type = "state";
        this.name = "runningRight";
    };

    app.systems.player.RunningRight.prototype.initialize = function (game) {
    };

    app.systems.player.RunningRight.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingRight");
    };

    app.systems.player.RunningRight.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
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

    app.systems.player.RunningRight.prototype.deactivated = function (entity) {

    };


});