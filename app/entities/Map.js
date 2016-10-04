BASE.require([
    "app.Entity",
    "app.properties.Size",
    "app.properties.Position",
    "app.entities.Camera",
    "app.properties.ImageTexture",
    "app.properties.Collidable"
], function () {

    BASE.namespace("app.entities");

    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Camera = app.entities.Camera;
    var ImageTexture = app.properties.ImageTexture;
    var Collision = app.properties.Collidable;

    app.entities.Map = function () {
        app.Entity.call(this);

        this.type = "map";
        this.id = "root";

        var ground = new app.Entity();
        ground.type = "ground";

        var props = new app.Entity();
        props.type = "props";

        var characters = new app.Entity();
        characters.type = "characters";

        var environment = new app.Entity();
        environment.type = "environment";

        var worldSize = new Size();
        worldSize.width = 2000;
        worldSize.height = 2000;

        var position = new Position();
        position.x = 0;
        position.y = 0;

        var collision = new Collision();
        collision.isStatic = true;

        //var image = new app.properties.ImageTexture();
        //image.path = "/images/props.png";
        //image.x = 0;
        //image.y = 0;
        //image.width = 720;
        //image.height = 621;

        //ground.addProperty(image);
        //ground.addProperty(worldSize);
        //ground.addProperty(position);
        //ground.addProperty(collision);

        this.appendChild(ground);
        this.appendChild(props);
        this.appendChild(characters);
        this.appendChild(environment);
        this.addProperty(worldSize);
        this.addProperty(position);
    };

    BASE.extend(app.entities.Map, app.Entity);

});