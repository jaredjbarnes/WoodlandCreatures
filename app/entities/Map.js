BASE.require([
    "app.Entity",
    "app.components.Transform"
], function () {

    BASE.namespace("app.entities");

    var Rect = app.components.Transform;

    app.entities.Map = function () {
        app.Entity.call(this);

        this.type = "map";

        var ground = new app.Entity();
        ground.type = "ground";

        var props = new app.Entity();
        props.type = "props";

        var villianRealm = new app.Entity();
        villianRealm.type = "villianRealm";

        var playerRealm = new app.Entity();
        playerRealm.type = "playerRealm";

        var environment = new app.Entity();
        environment.type = "environment";

        var worldSize = new Rect();
        worldSize.width = 2000;
        worldSize.height = 2000;

        this.appendChild(ground);
        this.appendChild(props);
        this.appendChild(villianRealm);
        this.appendChild(playerRealm);
        this.appendChild(environment);

        this.components.push(worldSize);
    };

    BASE.extend(app.entities.Map, app.Entity);

});