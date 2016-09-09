BASE.require([
    "app.properties.State",
], function () {
    BASE.namespace("app.systems");

    var State = app.properties.State;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var isComponentState = function (entity, system) {
        var stateProperty = entity.properties["state"];
        return stateProperty && stateProperty.length > 0;
    };

    app.systems.StateMachineSystem = function () {
        this.game = null;
        this.isReady = true;
        this.entities = [];
    };

    app.systems.StateMachineSystem.prototype.initializeStates = function (entity) {
        var states = entity.components["state"];
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (!state.isInitialized) {
                invokeMethod(state, "initialize", [entity]);
                state.isInitialized = true;
            }
        }
    };

    app.systems.StateMachineSystem.prototype.updateStates = function (stateName, entity) {
        var states = entity.components["state"];
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (state.name === stateName) {
                invokeMethod(state, "update", []);
            }
        }
    };

    app.systems.StateMachineSystem.prototype.activateStates = function (stateName, entity) {
        var states = entity.components["state"];
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];

            if (state.name === stateName) {
                invokeMethod(state, "activated", []);
            }
        }
    };

    app.systems.StateMachineSystem.prototype.deactivateStates = function (stateName, entity) {
        var states = entity.components["state"];
        var state;

        for (var x = 0 ; x < length; x++) {
            state = states[x];
            if (state.name === stateName) {
                invokeMethod(state, "deactivated", []);
            }
        }
    };

    app.systems.StateMachineSystem.prototype.updateState = function (entity) {
        var state = entity.properties["state"][0];
        var stateName = state.name;

        this.updateStates(stateName, entity);

        var newStateName = state.name;

        if (newStateName !== stateName) {
            this.deactivateStates(stateName, entity);
            this.activateStates(newStateName, entity);
            this.updateStates(newStateName, entity);
        }
    };

    app.systems.StateMachineSystem.prototype.update = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.updateState(entities[x]);
        }
    };

    app.systems.StateMachineSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isComponentState);
    };

    app.systems.StateMachineSystem.prototype.initializeEntities = function () {
        var entities = this.entities;
        var length = entities.length;

        for (var x = 0; x < length; x++) {
            this.initializeStates(entities[x]);
        }
    };

    app.systems.StateMachineSystem.prototype.activated = function (game) {
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
            state = entity.properties["state"][0];
            stateName = state.name;

            this.activateStates(stateName, entity);
        }
    };

    app.systems.StateMachineSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };

    app.systems.StateMachineSystem.prototype.entityAdded = function (entity) {
        this.entities.push(entity);
        this.initializeStates(entity);
    };

    app.systems.StateMachineSystem.prototype.entityRemoved = function (entity) {
        var index = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
        }
    };

});