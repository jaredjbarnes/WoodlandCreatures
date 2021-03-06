﻿BASE.require([
    "app.Entity",
    "app.properties.Position",
    "app.properties.Size",
    "app.properties.Collidable",
    "app.properties.ImageTexture",
    "app.properties.Ground"
], function () {

    BASE.namespace("app.entities");

    var Size = app.properties.Size;
    var Position = app.properties.Position;
    var Collidable = app.properties.Collidable;
    var ImageTexture = app.properties.ImageTexture;
    var Ground = app.properties.Ground;

    app.entities.CobbleStone = function () {
        app.Entity.call(this);

        this["@class"] = "app.entities.CobbleStone";
        this.type = "cobble-stone";

        var image = new app.properties.ImageTexture();
        image.path = "/images/props.png";
        image.position.x = 86;
        image.position.y = 1;
        image.size.width = 16;
        image.size.height = 16;

        var size = new Size();
        size.width = 16;
        size.height = 16;

        var position = new Position();
        position.x = 0;
        position.y = 0;
        position.isStatic = true;

        var ground = new Ground();

        var collidable = new Collidable();
        collidable.isStatic = true;

        this.addProperty(ground);
        this.addProperty(collidable);
        this.addProperty(image);
        this.addProperty(position);
        this.addProperty(size);

    };

    BASE.extend(app.entities.CobbleStone, app.Entity);

});