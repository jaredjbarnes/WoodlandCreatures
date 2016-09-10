BASE.require([
    "app.Entity",
    "app.properties.KeyboardInput",
    "app.properties.Transform",
    "app.properties.Collision",
    "app.properties.ImageTexture",
    "app.properties.Restraint",
    "app.properties.Sprite",
    "app.properties.State",
    "app.components.player.states.StandingRight",
    "app.components.player.states.StandingLeft",
    "app.components.player.states.StandingUp",
    "app.components.player.states.StandingDown",
    "app.components.player.states.RunningRight",
    "app.components.player.states.RunningLeft",
    "app.components.player.states.RunningUp",
    "app.components.player.states.RunningDown"
], function () {

    BASE.namespace("app.entities");

    var KeyboardInput = app.properties.KeyboardInput;
    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;
    var Sprite = app.properties.Sprite;
    var State = app.properties.State;
    var Restraint = app.properties.Restraint;
    var ImageTexture = app.properties.ImageTexture;
    var StandingRight = app.components.player.states.StandingRight;
    var StandingLeft = app.components.player.states.StandingLeft;
    var StandingUp = app.components.player.states.StandingUp;
    var StandingDown = app.components.player.states.StandingDown;
    var RunningLeft = app.components.player.states.RunningLeft;
    var RunningRight = app.components.player.states.RunningRight;
    var RunningUp = app.components.player.states.RunningUp;
    var RunningDown = app.components.player.states.RunningDown;

    app.entities.Player = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Player";
        this.type = "player";
        this.id = "main-character";

        var image = new app.properties.ImageTexture();
        image.path = "/images/link.gif";
        image.x = 0;
        image.y = 0;
        image.width = 25;
        image.height = 25;
        image.offset = {
            x: -5,
            y: -10
        };

        var transform = new Transform();
        transform.x = 10;
        transform.y = 10;
        transform.width = 15;
        transform.height = 15;

        var collision = new Collision();
        var keyboardInput = new KeyboardInput();

        var sprite = new Sprite();
        sprite.timeScale = .35;

        var state = new State();
        state.name = "standingRight";

        var standingRight = new StandingRight();
        var standingLeft = new StandingLeft();
        var standingUp = new StandingUp();
        var standingDown = new StandingDown();
        var runningRight = new RunningRight();
        var runningLeft = new RunningLeft();
        var runningUp = new RunningUp();
        var runningDown = new RunningDown();

        var restraint = new Restraint();
        restraint.byEntityId = "root";

        this.addProperty(restraint);
        this.addProperty(state);
        this.addProperty(image);
        this.addProperty(transform);
        this.addProperty(keyboardInput);
        this.addProperty(sprite);
        this.addProperty(collision);

        this.addComponent(standingRight);
        this.addComponent(standingLeft);
        this.addComponent(standingUp);
        this.addComponent(standingDown);
        this.addComponent(runningRight);
        this.addComponent(runningLeft);
        this.addComponent(runningUp);
        this.addComponent(runningDown);
    };

    BASE.extend(app.entities.Player, app.Entity);

});