﻿BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collision = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;

    app.entities.WitchHut = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.WitchHut";
        this.type = "witch-hut";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 110;
        image.position.y = 194;
        image.size.width = 64;
        image.size.height = 92;

        var size = new Size();
        size.width = 64;
        size.height = 92;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var collision = new Collision();
        collision.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 8,
            y: 30
        }, {
            x: 56,
            y: 30
        }, {
            x: 56,
            y: 67
        }, {
            x: 53,
            y: 85
        }, {
            x: 10,
            y: 85
        }, {
            x: 8,
            y: 68
        });

        this.addProperty(rigidBody);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);
        this.addProperty(collision);

    };

    BASE.extend(app.entities.WitchHut, app.Entity);

});