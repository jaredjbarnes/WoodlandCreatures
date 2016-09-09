BASE.require([
    "app.Entity",
    "app.properties.Transform",
    "app.entities.Camera"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.properties.Transform;
    var Camera = app.entities.Camera;

    app.entities.Map = function () {
        app.Entity.call(this);

        this.type = "map";

        var ground = new app.Entity();
        ground.type = "ground";

        var props = new app.Entity();
        props.type = "props";

        var characters = new app.Entity();
        characters.type = "characters";

        var environment = new app.Entity();
        environment.type = "environment";

        var worldSize = new Transform();
        worldSize.width = 2000;
        worldSize.height = 2000;

        var camera = new Camera();

        this.appendChild(ground);
        this.appendChild(props);
        this.appendChild(characters);
        this.appendChild(environment);
        this.appendChild(camera);

        this.addProperty(worldSize);
    };

    BASE.extend(app.entities.Map, app.Entity);

});