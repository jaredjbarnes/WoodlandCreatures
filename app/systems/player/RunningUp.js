BASE.require([
    "app.systems.player.handleStateChangeByInput"
], function () {

    BASE.namespace("app.systems.player");

    var handleStateChangeByInput = app.systems.player.handleStateChangeByInput;

    app.systems.player.RunningUp = function () {
        this["@class"] = "app.systems.player.RunningUp";
        this.type = "state";
        this.name = "runningUp";

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
                x: 0
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 25
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 50
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 75
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 100
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 125
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 150
            }
        }, {
            path: path,
            size: size,
            offset: offset,
            position: {
                y: 25,
                x: 175
            }
        }];
    };

    app.systems.player.RunningUp.prototype.initialize = function (entity) {
    };

    app.systems.player.RunningUp.prototype.update = function (entity) {
        handleStateChangeByInput(entity, "standingUp");
    };

    app.systems.player.RunningUp.prototype.activated = function (entity) {
        var sprite = entity.properties["sprite"][0];
        sprite.index = 0;
        sprite.images = this.spriteImages;
    };

    app.systems.player.RunningUp.prototype.deactivated = function () {

    };


});