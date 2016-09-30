BASE.require([
    "app.properties.State",
], function () {
    BASE.namespace("app.systems");

    var State = app.properties.State;

    var invokeMethod = function (obj, methodName, args) {
        if (obj != null && typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    var isState = function (entity) {
        return entity.hasProperties(["state"]);
    };

    app.systems.StateMachineSystem = function () {
        this.game = null;
        this.isReady = true;
        this.name = null;
        this.entities = [];
        this.states = {};
    };

    app.systems.StateMachineSystem.prototype.updateStates = function (stateName, entity) {
        var state = this.states[stateName];
        invokeMethod(state, "update", [entity]);
    };

    app.systems.StateMachineSystem.prototype.activateStates = function (stateName, entity) {
        var state = this.states[stateName];

        invokeMethod(state, "activated", [entity]);
    };

    app.systems.StateMachineSystem.prototype.deactivateStates = function (stateName, entity) {
        var state = this.states[stateName];
        invokeMethod(state, "deactivated", [entity]);
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
        this.entities = this.game.stage.filter(isState);
    };

    app.systems.StateMachineSystem.prototype.activated = function (game) {
        this.game = game;
        this.cacheEntities();

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
        if (entity.hasProperties(["state"])){
            this.entities.push(entity);
        }
    };

    app.systems.StateMachineSystem.prototype.entityRemoved = function (entity) {
        var index = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
        }
    };

    app.systems.StateMachineSystem.prototype.addState = function (name, state) {
        if (typeof name === "string" && state != null) {
            this.states[name] = state;
            invokeMethod(state, "initialize", [this.game]);
        }
    };

});