BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningRight = function () {
        this["@class"] = "app.systems.player.RunningRight";
        this.type = "state";
        this.name = "runningRight";

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
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 225
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 250
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 275
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 300
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 325
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 350
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 0,
                x: 375
            }
        }];
    };

    app.systems.player.RunningRight.prototype.initialize = function (game) {
    };

    app.systems.player.RunningRight.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingRight");
    };

    app.systems.player.RunningRight.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.RunningRight.prototype.deactivated = function (entity) {

    };


});