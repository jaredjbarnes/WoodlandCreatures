BASE.require([
    "app.components.StateMachine",
    "app.properties.State",
], function () {
    BASE.namespace("app.systems");

    var StateMachine = app.components.StateMachine;
    var State = app.properties.State;

    var invokeMethod = function (obj, methodName, args) {
        if (typeof obj[methodName] === "function") {
            obj[methodName].apply(obj, args);
        }
    };

    var isStateMachine = function (entity, system) {
        return entity.hasComponentOfType(StateMachine) && entity.hasPropertyByType(State);
    };

    app.systems.StateMachineSystem = function () {
        this.game = null;
        this.isReady = true;
        this.entities = [];
    };

    app.systems.StateMachineSystem.prototype.updateSystems = function (stateName, entity) {
        var stateMachines = entity.getComponentsOfType(StateMachine);

        for (var x = 0 ; x < length; x++) {
            invokeMethod(stateMachines[x].states[stateName], "update", [entity, this]);
        }
    };

    app.systems.StateMachineSystem.prototype.activateSystems = function (stateName, entity) {
        var stateMachines = entity.getComponentsOfType(StateMachine);

        for (var x = 0 ; x < length; x++) {
            invokeMethod(stateMachines[x].states[stateName], "activated", [entity, this]);
        }
    };

    app.systems.StateMachineSystem.prototype.deactivateSystems = function (stateName, entity) {
        var stateMachines = entity.getComponentsOfType(StateMachine);

        for (var x = 0 ; x < length; x++) {
            invokeMethod(stateMachines[x].states[stateName], "deactivated", [entity, this]);
        }
    };

    app.systems.StateMachineSystem.prototype.updateState = function (entity) {
        var state = entity.getComponentByType(State);
        var stateName = state.name;

        this.updateSystems(stateName, entity);

        var newStateName = state.name;

        if (newStateName !== stateName) {
            this.deactivateSystems(stateName, entity);
            this.activateSystems(newStateName, entity);
            this.updateSystems(newStateName, entity);
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
        this.entities = this.game.rootEntity.filter(isStateMachine);
    };

    app.systems.StateMachineSystem.prototype.activated = function (game) {
        this.game = game;
        this.timer = this.game.timer;
        this.cacheEntities();

        var entity = null;
        var entities = this.entities;
        var length = entities.length;
        var stateName = null;
        var state = null;

        for (var x = 0; x < length; x++) {
            entity = entities[x];
            state = entity.getComponentByType(State);
            stateName = state.name;

            this.activateSystems(stateName, entity);
        }
    };

    app.systems.StateMachineSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };

});