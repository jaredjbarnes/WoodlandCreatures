BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningDown = function () {
        this["@class"] = "app.systems.player.RunningDown";
        this.type = "state";
        this.name = "runningDown";

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
                y: 25,
                x: 200
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 225
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 250
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 275
            }
        }, , {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 300
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 325
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 350
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 375
            }
        }];
    };

    app.systems.player.RunningDown.prototype.initialize = function (game) {
    };

    app.systems.player.RunningDown.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingDown");
    };

    app.systems.player.RunningDown.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.RunningDown.prototype.deactivated = function (entity) {

    };


});