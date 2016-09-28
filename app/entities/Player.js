BASE.require([
    "app.Entity",
    "app.properties.KeyboardInput",
    "app.properties.Movement",
    "app.properties.Size",
    "app.properties.Position",
    "app.properties.Collision",
    "app.properties.ImageTexture",
    "app.properties.PositionConstraint",
    "app.properties.Sprite",
    "app.properties.RectangleBody",
    "app.properties.State",
    "app.properties.TouchInput"
], function () {

    BASE.namespace("app.entities");

    var KeyboardInput = app.properties.KeyboardInput;
    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Movement = app.properties.Movement;
    var Collision = app.properties.Collision;
    var RectangleBody = app.properties.RectangleBody;
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
        var touchInput = new TouchInput();

        var sprite = new Sprite();
        sprite.timeScale = .35;

        var state = new State();
        state.name = "standingRight";

        var rectangleBody = new RectangleBody();
        rectangleBody.size.width = 15;
        rectangleBody.size.height = 10;
        rectangleBody.offset.y = 15;
        rectangleBody.offset.x = 5;

        var positionConstraint = new PositionConstraint();
        positionConstraint.byEntityId = "root";

        this.addProperty(movement);
        this.addProperty(rectangleBody);
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