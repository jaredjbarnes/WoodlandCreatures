BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.StandingRight = function () {
        this["@class"] = "app.systems.player.StandingRight";
        this.type = "state";
        this.name = "standingRight";

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
                x: 200
            }
        }];
    };

    app.systems.player.StandingRight.prototype.initialize = function (game) {
    };

    app.systems.player.StandingRight.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingRight");
    };

    app.systems.player.StandingRight.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.StandingRight.prototype.deactivated = function (entity) {

    };


});