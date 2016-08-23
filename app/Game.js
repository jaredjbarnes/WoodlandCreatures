(function () {
    BASE.namespace("app");

    var pausedState = {
        play: function (game) {
            game.timer.play();
            game.state = startedState;
        },
        pause: function () { }
    };

    var startedState = {
        play: function () { },
        pause: function (game) {
            game.timer.pause();
            game.state = pausedState;
        }
    };

    app.Game = function (rootEntity, timer) {
        this.timer = timer;
        this.systems = [];
        this.rootEntity = rootEntity;
        this.state = pausedState;
        this.frame = null;
    };

    app.Game.prototype.invokeMethodOnSystem = function (system, methodName, args) {
        if (typeof system[methodName] === "function") {
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