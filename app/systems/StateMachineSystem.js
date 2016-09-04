BASE.require([
    "app.components.ComponentState",
    "app.properties.State",
], function () {
    BASE.namespace("app.systems");

    var ComponentState = app.components.ComponentState;
    var State = app.properties.State;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var isComponentState = function (entity, system) {
        return entity.hasComponentOfType(ComponentState) && entity.hasPropertyByType(State);
    };

    app.systems.ComponentStateSystem = function () {
        this.game = null;
        this.isReady = true;
        this.entities = [];
    };

    app.systems.ComponentStateSystem.prototype.initializeStates = function (stateName, entity) {
        var states = entity.getComponentsOfType(ComponentState);

        for (var x = 0 ; x < length; x++) {
            if (!state.isInitialized) {
                invokeMethod([stateName], "initialize", [entity]);
            }
        }
    };

    app.systems.ComponentStateSystem.prototype.updateStates = function (stateName, entity) {
        var states = entity.getComponentsOfType(ComponentState);
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (state.name === stateName) {
                invokeMethod([stateName], "update", []);
            }
        }
    };

    app.systems.ComponentStateSystem.prototype.activateStates = function (stateName, entity) {
        var states = entity.getComponentsOfType(ComponentState);
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (state.name === stateName) {
                invokeMethod([stateName], "activated", []);
            }
        }
    };

    app.systems.ComponentStateSystem.prototype.deactivateStates = function (stateName, entity) {
        var states = entity.getComponentsOfType(ComponentState);
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (state.name === stateName) {
                invokeMethod([stateName], "deactivated", []);
            }
        }
    };

    app.systems.ComponentStateSystem.prototype.updateState = function (entity) {
        var state = entity.getComponentByType(State);
        var stateName = state.name;

        this.updateStates(stateName, entity);

        var newStateName = state.name;

        if (newStateName !== stateName) {
            this.deactivateStates(stateName, entity);
            this.activateStates(newStateName, entity);
            this.updateStates(newStateName, entity);
        }
    };

    app.systems.ComponentStateSystem.prototype.update = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.updateState(entities[x]);
        }
    };

    app.systems.ComponentStateSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isComponentState);
    };

    app.systems.ComponentStateSystem.prototype.initializeEntities = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.initializeStates(entities[x]);
        }
    };

    app.systems.ComponentStateSystem.prototype.activated = function (game) {
        this.game = game;
        this.cacheEntities();
        this.initializeEntities();

        var entity = null;
        var entities = this.entities;
        var length = entities.length;
        var stateName = null;
        var state = null;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            state = entity.getComponentByType(State);
            stateName = state.name;

            this.activateStates(stateName, entity);
        }
    };

    app.systems.ComponentStateSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };

});