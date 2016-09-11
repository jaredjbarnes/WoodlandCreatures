BASE.require([
    "app.Entity",
    "app.properties.KeyboardInput",
    "app.properties.Movement",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.Collision",
    "app.components.PropCollisionHandler",
    "app.properties.ImageTexture",
    "app.properties.PositionConstraint",
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
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Movement = app.properties.Movement;
    var Collision = app.properties.Collision;
    var PropCollisionHandler = app.components.PropCollisionHandler;
    var Sprite = app.properties.Sprite;
    var State = app.properties.State;
    var PositionConstraint = app.properties.PositionConstraint;
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

        var size = new Size();
        size.width = 25;
        size.height = 25;

        var position = new Position();
        position.x = 10;
        position.y = 10;

        var collision = new Collision();
        var movement = new Movement();
        var keyboardInput = new KeyboardInput();

        var sprite = new Sprite();
        sprite.timeScale = .35;

        var state = new State();
        state.name = "standingRight";

        var propCollisionHandler = new PropCollisionHandler();

        var standingRight = new StandingRight();
        var standingLeft = new StandingLeft();
        var standingUp = new StandingUp();
        var standingDown = new StandingDown();
        var runningRight = new RunningRight();
        var runningLeft = new RunningLeft();
        var runningUp = new RunningUp();
        var runningDown = new RunningDown();

        var positionConstraint = new PositionConstraint();
        positionConstraint.byEntityId = "root";

        this.addProperty(movement);
        this.addProperty(positionConstraint);
        this.addProperty(state);
        this.addProperty(image);
        this.addProperty(size);
        this.addProperty(position);
        this.addProperty(keyboardInput);
        this.addProperty(sprite);
        this.addProperty(collision);

        this.addComponent(propCollisionHandler);
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