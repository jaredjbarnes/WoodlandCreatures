(function () {
    BASE.namespace("app");

    var pausedState = {
        play: function () {
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

    app.Game = function (timer) {
        this.timer = timer;
        this.systems = [];
        this.rootEntity = null;
        this.state = pausedState;
        this.frame = null;
    };

    app.Game.prototype.invokeMethodOnSystem = function (system, methodName, args) {
        if (typeof system[methodName] === "function") {
            return system[methodName].apply(system, args);
        }
    };

    app.Game.prototype.loop = function () {
        this.frame = requestAnimationFrame(function () {
            game.update();
            game.loop();
        });
    };

    app.Game.prototype.play = function () {
        var game = this;
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

    app.Game.prototype.addSystem = function (system) {
        system.init(this);
        this.systems.push(system);
    };

    app.Game.prototype.isReady = function () {
        return this.systems.every(function (system) {
            return system.isReady;
        });
    };

}());