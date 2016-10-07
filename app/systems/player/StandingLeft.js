BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.StandingLeft = function () {
        this["@class"] = "app.systems.player.StandingLeft";
        this.type = "state";
        this.name = "standingLeft";

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
                y: 0,
                x: 0
            }
        }];
    };

    app.systems.player.StandingLeft.prototype.initialize = function (game) {
    };

    app.systems.player.StandingLeft.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingLeft");
    };

    app.systems.player.StandingLeft.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.StandingLeft.prototype.deactivated = function (entity) {

    };


});