BASE.require([
    "app.Entity",
    "app.properties.Transform"
], function () {

    BASE.namespace("app.entities");

    var Transform = app.properties.Transform;

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

        this.appendChild(ground);
        this.appendChild(props);
        this.appendChild(characters);
        this.appendChild(environment);

        this.properties.push(worldSize);
    };

    BASE.extend(app.entities.Map, app.Entity);

});