BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody",
    "app.properties.Sprite"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collidable = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;
    var Sprite = app.properties.Sprite;

    app.entities.WindVane = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.WindVane";
        this.type = "wind-vane";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 194;
        image.position.y = 5;
        image.size.width = 32;
        image.size.height = 55;

        var size = new Size();
        size.width = 32;
        size.height = 55;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var sprite = new Sprite();
        var offset = {
            x: 0,
            y: 0
        };

        sprite.timeScale = .10;


        sprite.images = [{
            offset: offset,
            path: "/images/props.png",
            position: {
                x: 194,
                y: 5
            },
            size: {
                width: 32,
                height: 55
            }
        }, {
            offset: offset,
            path: "/images/props.png",
            position: {
                x: 231,
                y: 5
            },
            size: {
                width: 32,
                height: 55
            }
        }, {
            offset: offset,
            path: "/images/props.png",
            position: {
                x: 268,
                y: 5
            },
            size: {
                width: 32,
                height: 55
            }
        }];

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 24
        }, {
            x: 32,
            y: 24
        }, {
            x: 32,
            y: 55
        }, {
            x: 0,
            y: 55
        });

        var collidable = new Collidable();
        collidable.isStatic = true;

        this.addProperty(rigidBody);
        this.addProperty(collidable);
        this.addProperty(sprite);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);

    };

    BASE.extend(app.entities.WindVane, app.Entity);

});