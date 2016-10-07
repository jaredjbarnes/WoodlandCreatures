BASE.require([
    "app.Entity",
    "app.properties.KeyboardInput",
    "app.properties.Movement",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.PositionConstraint",
    "app.properties.Sprite",
    "app.properties.RigidBody",
    "app.properties.State",
    "app.properties.TouchInput"
], function () {

    BASE.namespace("app.entities");

    var KeyboardInput = app.properties.KeyboardInput;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Movement = app.properties.Movement;
    var Collision = app.properties.Collidable;
    var RigidBody = app.properties.RigidBody;
    var Sprite = app.properties.Sprite;
    var State = app.properties.State;
    var PositionConstraint = app.properties.PositionConstraint;
    var ImageTexture = app.properties.ImageTexture;
    var TouchInput = app.properties.TouchInput;

    app.entities.Player = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Player";
        this.type = "player";
        this.id = "main-character";

        var image = new app.properties.ImageTexture();
        image.path = "/images/link.gif";
        image.position.x = 0;
        image.position.y = 0;
        image.size.width = 25;
        image.size.height = 25;

        var size = new Size();
        size.width = 25;
        size.height = 25;

        var position = new Position();
        position.x = 10;
        position.y = 10;

        var collision = new Collision();
        var movement = new Movement();
        var keyboardInput = new KeyboardInput();
        var touchInput = new TouchInput();

        var sprite = new Sprite();
        sprite.timeScale = .35;

        var state = new State();
        state.name = "standingRight";

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 5,
            y: 19
        }, {
            x: 17,
            y: 19
        }, {
            x: 17,
            y: 24
        }, {
            x: 5,
            y: 24
        });

        var positionConstraint = new PositionConstraint();
        positionConstraint.byEntityId = "root";

        this.addProperty(movement);
        this.addProperty(rigidBody);
        this.addProperty(positionConstraint);
        this.addProperty(state);
        this.addProperty(image);
        this.addProperty(size);
        this.addProperty(position);
        this.addProperty(keyboardInput);
        this.addProperty(touchInput);
        this.addProperty(sprite);
        this.addProperty(collision);
    };

    BASE.extend(app.entities.Player, app.Entity);

});