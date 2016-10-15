BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody",
    "app.properties.Sprite",
    "app.properties.Ground"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var Ground = app.properties.Ground;
    var Sprite = app.properties.Sprite;

    app.entities.Flower = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.Flower";
        this.type = "flower";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 1;
        image.position.y = 535;
        image.size.width = 16;
        image.size.height = 16;

        var size = new Size();
        size.width = 32;
        size.height = 55;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var ground = new Ground();

        var sprite = new Sprite();
        var offset = {
            x: 0,
            y: 0
        };

        sprite.timeScale = 0.05;

        sprite.images = [{
            offset: offset,
            path: "/images/props.png",
            position: {
                x: 1,
                y: 535
            },
            size: {
                width: 16,
                height: 16
            }
        }, {
            offset: offset,
            path: "/images/props.png",
            position: {
                x: 1,
                y: 552
            },
            size: {
                width: 16,
                height: 16
            }
        }];

        this.addProperty(sprite);
        this.addProperty(ground);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.Flower, app.Entity);

});