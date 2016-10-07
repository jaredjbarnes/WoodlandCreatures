BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.StandingUp = function () {
        this["@class"] = "app.systems.player.StandingUp";
        this.type = "state";
        this.name = "standingUp";

        var size = {
            width: 25,
            height: 25
        };

        var offset = {
            x: 0,
            y: 0
        };

        var path = "/images/link.gif";

        this.spriteImages = [{
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 50,
                x: 0
            }
        }];
    };

    app.systems.player.StandingUp.prototype.initialize = function (game) {
    };

    app.systems.player.StandingUp.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingUp");
    };

    app.systems.player.StandingUp.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.StandingUp.prototype.deactivated = function (entity) {

    };


});