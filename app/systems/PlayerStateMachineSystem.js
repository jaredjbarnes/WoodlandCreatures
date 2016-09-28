BASE.require([
    "app.systems.StateMachineSystem",
    "app.systems.player.StandingRight",
    "app.systems.player.StandingLeft",
    "app.systems.player.StandingUp",
    "app.systems.player.StandingDown",
    "app.systems.player.RunningRight",
    "app.systems.player.RunningLeft",
    "app.systems.player.RunningUp",
    "app.systems.player.RunningDown"
], function () {

    BASE.namespace("app.systems");

    var StateMachineSystem = app.systems.StateMachineSystem;
    var StandingRight = app.systems.player.StandingRight;
    var StandingLeft = app.systems.player.StandingLeft;
    var StandingUp = app.systems.player.StandingUp;
    var StandingDown = app.systems.player.StandingDown;
    var RunningLeft = app.systems.player.RunningLeft;
    var RunningRight = app.systems.player.RunningRight;
    var RunningUp = app.systems.player.RunningUp;
    var RunningDown = app.systems.player.RunningDown;

    app.systems.PlayerStateMachineSystem = function () {
        StateMachineSystem.call(this);

        this.addState("standingRight", new StandingRight());
        this.addState("standingLeft", new StandingLeft());
        this.addState("standingUp", new StandingUp());
        this.addState("standingDown", new StandingDown());
        this.addState("runningLeft", new RunningLeft());
        this.addState("runningRight", new RunningRight());
        this.addState("runningUp", new RunningUp());
        this.addState("runningDown", new RunningDown());

    };

    BASE.extend(app.systems.PlayerStateMachineSystem, StateMachineSystem);

});