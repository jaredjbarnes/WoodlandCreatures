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
                    y: 50,
                    x: 25
                }];
            }
        },
        standingUpState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 50,
                    x: 0
                }];
            }
        },
        standingLeftState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 0,
                    x: 0
                }];
            }
        },
        standingRightState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 0,
                    x: 200
                }];
            }
        },
        runningDownState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
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
            }
        },
        runningUpState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 25,
                    x: 0
                }, {
                    y: 25,
                    x: 25
                }, {
                    y: 25,
                    x: 50
                }, {
                    y: 25,
                    x: 75
                }, {
                    y: 25,
                    x: 100
                }, {
                    y: 25,
                    x: 125
                }, {
                    y: 25,
                    x: 150
                }, {
                    y: 25,
                    x: 175
                }];
            }
        },
        runningLeftState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
                sprite.index = 0;
                sprite.positions = [{
                    y: 0,
                    x: 0
                }, {
                    y: 0,
                    x: 25
                }, {
                    y: 0,
                    x: 50
                }, {
                    y: 0,
                    x: 75
                }, {
                    y: 0,
                    x: 100
                }, {
                    y: 0,
                    x: 125
                }, {
                    y: 0,
                    x: 150
                }, {
                    y: 0,
                    x: 175
                }];
            }
        },
        runningRightState: {
            activated: function (entity, playerSystem) {
                var sprite = entity.getComponentByType(Sprite);
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