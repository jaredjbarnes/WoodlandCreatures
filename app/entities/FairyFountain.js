﻿BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.RigidBody",
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collidable = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var RigidBody = app.properties.RigidBody;

    app.entities.FairyFountain = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.FairyFountain";
        this.type = "fairy-fountain";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 660;
        image.position.y = 286;
        image.size.width = 32;
        image.size.height = 32;

        var size = new Size();
        size.width = 32;
        size.height = 32;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var rigidBody = new RigidBody();
        rigidBody.points.push({
            x: 0,
            y: 10
        }, {
            x: 33,
            y: 10
        }, {
            x: 32,
            y: 32
        }, {
            x: 1,
            y: 32
        });

        var collidable = new Collidable();
        collidable.isStatic = true;

        this.addProperty(rigidBody);
        this.addProperty(collidable);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);

    };

    BASE.extend(app.entities.FairyFountain, app.Entity);

});