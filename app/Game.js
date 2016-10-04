(function () {
    BASE.namespace("app");

    var pausedState = {
        play: function (game) {
            game.timer.play();
            game.state = startedState;
            game.systems.forEach(function (system) {
                game.invokeMethodOnSystem(system, "started", []);
            });
        },
        pause: function () { }
    };

    var startedState = {
        play: function () { },
        pause: function (game) {
            game.timer.pause();
            game.state = pausedState;
            game.systems.forEach(function (system) {
                game.invokeMethodOnSystem(system, "paused", []);
            });
        }
    };

    app.Game = function (stage, timer) {
        this.timer = timer;
        this.systems = [];
        this.stage = stage;
        this.state = pausedState;
        this.frame = null;
        this.stage.delegate = this;
    };

    app.Game.prototype.propertyAdded = function (entity) {
        var systems = this.systems;
        var length = systems.length;
        for (var x = 0; x < length; x++) {
            this.invokeMethodOnSystem(systems[x], "propertyAdded", [entity, property]);
        }
    };

    app.Game.prototype.propertyRemoved = function (entity) {
        var systems = this.systems;
        var length = systems.length;
        for (var x = 0; x < length; x++) {
            this.invokeMethodOnSystem(systems[x], "propertyRemoved", [entity, property]);
        }
    };

    app.Game.prototype.entityAdded = function (entity) {
        var systems = this.systems;
        var length = systems.length;
        for (var x = 0; x < length; x++) {
            this.invokeMethodOnSystem(systems[x], "entityAdded", [entity]);
        }
    };

    app.Game.prototype.entityRemoved = function (entity) {
        var systems = systems;
        var length = systems.length;
        for (var x = 0; x < length; x++) {
            this.invokeMethodOnSystem(systems[x], "entityRemoved", [entity]);
        }
    };

    app.Game.prototype.invokeMethodOnSystem = function (system, methodName, args) {
        if (system && typeof system[methodName] === "function") {
            return system[methodName].apply(system, args);
        }
    };

    app.Game.prototype.loop = function () {
        var game = this;
        this.frame = requestAnimationFrame(function () {
            game.update();
            game.loop();
        });
    };

    app.Game.prototype.play = function () {
        this.state.play(this);
        this.loop();
    };

    app.Game.prototype.pause = function () {
        this.state.pause(this);
        cancelAnimationFrame(this.frame);
    }

    app.Game.prototype.update = function () {
        var game = this;

        if (this.isReady()) {
            this.systems.forEach(function (system) {
                game.invokeMethodOnSystem(system, "beforeUpdate", []);
            });

            this.systems.forEach(function (system) {
                game.invokeMethodOnSystem(system, "update", []);
            });

            this.systems.forEach(function (system) {
                game.invokeMethodOnSystem(system, "afterUpdate", []);
            });
        }

    };

    app.Game.prototype.appendSystem = function (system) {
        this.systems.push(system);
        this.invokeMethodOnSystem(system, "activated", [this]);
    };

    app.Game.prototype.removeSystem = function (system) {
        var index = this.systems.indexOf(system);

        if (index > -1) {
            var system = this.systems.splice(index, 1);
            this.invokeMethodOnSystem(system, "deactivated", [this]);
        }
    };

    app.Game.prototype.insertSystemBefore = function (system, referenceSystem) {
        var index = this.systems.indexOf(referenceSystem);

        if (index > -1) {
            var system = this.systems.splice(index, 0, system);
            this.invokeMethodOnSystem(system, "activated", [this]);
        }
    };

    app.Game.prototype.isReady = function () {
        return this.systems.every(function (system) {
            return system.isReady;
        });
    };

}());