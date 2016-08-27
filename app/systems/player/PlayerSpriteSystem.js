BASE.require([
    "app.components.Sprite"
], function () {

    BASE.namespace("app.systems.player");

    var Sprite = app.components.Sprite;

    app.systems.player.PlayerSpriteSystem = function () {
        this.game = null;
    };

    app.systems.player.PlayerSpriteSystem.prototype.states = {
        standingDownState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 209,
                    x: 47
                }];
            }
        },
        standingUpState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 208,
                    x: 94
                }];
            }
        },
        standingLeftState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 9,
                    x: 8
                }];
            }
        },
        standingRightState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 8,
                    x: 198
                }];
            }
        },
        runningDownState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 42,
                    x: 198
                }, {
                    y: 42,
                    x: 219
                }, {
                    y: 42,
                    x: 244
                }, {
                    y: 42,
                    x: 267
                }, {
                    y: 42,
                    x: 291
                }, {
                    y: 42,
                    x: 315
                }, {
                    y: 42,
                    x: 336
                }, {
                    y: 42,
                    x: 357
                }];
            }
        },
        runningUpState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 42,
                    x: 8
                }, {
                    y: 42,
                    x: 33
                }, {
                    y: 42,
                    x: 57
                }, {
                    y: 42,
                    x: 79
                }, {
                    y: 42,
                    x: 101
                }, {
                    y: 42,
                    x: 126
                }, {
                    y: 42,
                    x: 151
                }, {
                    y: 42,
                    x: 173
                }];
            }
        },
        runningLeftState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 9,
                    x: 8
                }, {
                    y: 9,
                    x: 33
                }, {
                    y: 9,
                    x: 57
                }, {
                    y: 9,
                    x: 79
                }, {
                    y: 9,
                    x: 101
                }, {
                    y: 9,
                    x: 126
                }, {
                    y: 9,
                    x: 151
                }, {
                    y: 9,
                    x: 173
                }];
            }
        },
        runningRightState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 8,
                    x: 198
                }, {
                    y: 8,
                    x: 219
                }, {
                    y: 8,
                    x: 244
                }, {
                    y: 8,
                    x: 267
                }, {
                    y: 8,
                    x: 291
                }, {
                    y: 8,
                    x: 315
                }, {
                    y: 8,
                    x: 336
                }, {
                    y: 8,
                    x: 357
                }];

            }
        },
        strikingDownState: {
            activated: function (entity, playerSystem) { }
        },
        strikingUpState: {
            activated: function (entity, playerSystem) { }
        },
        strikingLeftState: {
            activated: function (entity, playerSystem) { }
        },
        strikingRightState: {
            activated: function (entity, playerSystem) { }
        }
    };

});