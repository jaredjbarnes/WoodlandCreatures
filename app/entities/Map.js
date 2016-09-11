BASE.require([
    "app.Entity",
    "app.properties.Size",
    "app.properties.Position",
    "app.entities.Camera"
], function () {

    BASE.namespace("app.entities");

    var Position = app.properties.Position;
    var Size = app.properties.Size;
    var Camera = app.entities.Camera;

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

        var camera = new Camera();

        this.appendChild(ground);
        this.appendChild(props);
        this.appendChild(characters);
        this.appendChild(environment);
        this.appendChild(camera);

        this.addProperty(worldSize);
        this.addProperty(position);
    };

    BASE.extend(app.entities.Map, app.Entity);

});