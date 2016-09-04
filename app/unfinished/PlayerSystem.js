BASE.require([
    "app.components.PlayerState",
    "app.components.Render",
    "app.components.Sprite",
    "app.components.Transform",
    "app.systems.player.PlayerSpriteSystem",
    "app.systems.player.PlayerInputSystem"
], function () {
    BASE.namespace("app.systems");

    var PlayerState = app.components.PlayerState;
    var Render = app.components.Render;
    var PlayerInputSystem = app.systems.player.PlayerInputSystem;
    var PlayerSpriteSystem = app.systems.player.PlayerSpriteSystem;
    var Sprite = app.components.Sprite;
    var Transform = app.components.Transform;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var isPlayer = function (entity, system) {
        return entity.type === "Player" && entity.hasComponentByType(PlayerState) && entity.hasComponentByType(Render) && entity.hasComponentByType(Sprite);
    };

    app.systems.PlayerSystem = function (inputSystem, collisionSystem, inputMapping) {
        this.game = null;
        var timer = null;
        this.isReady = true;
        this.entities = [];
        this.inputSystem = inputSystem;
        this.collisionSystem = collisionSystem;
        this.playerSystems = [new PlayerSpriteSystem(), new PlayerInputSystem()];

        this.inputMapping = inputMapping || {
            "left": "runningLeftState",
            "up": "runningUpState",
            "right": "runningRightState",
            "down": "runningDownState"
        };
    };

    app.systems.PlayerSystem.prototype.updateSystems = function (stateName, entity) {
        var length = this.playerSystems.length;
        var playerSystems = this.playerSystems;

        for (var x = 0 ; x < length; x++) {
            invokeMethod(playerSystems[x].states[stateName], "update", [entity, this]);
        }
    };

    app.systems.PlayerSystem.prototype.activateSystems = function (stateName, entity) {
        var length = this.playerSystems.length;
        var playerSystems = this.playerSystems;

        for (var x = 0 ; x < length; x++) {
            invokeMethod(playerSystems[x].states[stateName], "activated", [entity, this]);
        }
    };

    app.systems.PlayerSystem.prototype.deactivateSystems = function (stateName, entity) {
        var length = this.playerSystems.length;
        var playerSystems = this.playerSystems;

        for (var x = 0 ; x < length; x++) {
            invokeMethod(playerSystems[x].states[stateName], "deactivated", [entity, this]);
        }
    };

    app.systems.PlayerSystem.prototype.updatePlayer = function (entity) {
        var playerState = entity.getComponentByType(PlayerState);
        var stateName = playerState.name;

        this.updateSystems(stateName, entity);

        var newStateName = playerState.name;

        if (newStateName !== stateName) {
            this.deactivateSystems(stateName, entity);
            this.activateSystems(newStateName, entity);
            this.updateSystems(newStateName, entity);
        }
    };

    app.systems.PlayerSystem.prototype.update = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.updatePlayer(entities[x]);
        }
    };

    app.systems.PlayerSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isPlayer);
    };

    app.systems.PlayerSystem.prototype.activated = function (game) {
        this.game = game;
        this.timer = this.game.timer;
        this.cacheEntities();

        var entity = null;
        var entities = this.entities;
        var length = entities.length;
        var stateName = null;
        var playerState = null;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            playerState = entity.getComponentByType(PlayerState);
            stateName = playerState.name;

            this.activateSystems(stateName, entity);
        }
    };

    app.systems.PlayerSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };

});