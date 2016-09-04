BASE.require([
    "app.properties.ImageTexture",
    "app.properties.Transform",
    "app.properties.Viewport"
], function () {

    BASE.namespace("app.systems");

    var Render = app.properties.ImageTexture;
    var Transform = app.properties.Transform;
    var Viewport = app.properties.Viewport;

    var emptyFn = function () { };

    app.systems.ColorSystem = function (canvas) {
        var camera = this;

        Transform.call(this);
        this.game = null;
        this.rootEntity = null;
        this.width = canvas.width;
        this.height = canvas.height;
        this.isReady = false;
        this.context = canvas.getContext("2d");
        this.imageMap = {};
        this.entities = [];

        this.onScreenFilter = function (entity) {
            var rect = entity.getPropertyByType(Transform);
            var viewport = entity.getPropertyByType(Viewport);
            var intersection = rect.getIntersection(camera);

            if (viewport == null) {
                viewport = new Viewport();
                entity.properties.push(viewport);
            }

            if (intersection != null) {
                viewport.withInBounds = true;
            } else {
                viewport.withInBounds = false;
            }

            return viewport.withInBounds;
        };

        this.isRender = function (entity) {
            return entity.hasComponentByType(Render) && entity.hasComponentByType(Transform);
        };
    };

    BASE.extend(app.systems.ColorSystem, Transform);

    app.systems.ColorSystem.prototype.getEntitiesOnViewport = function () {
        var camera = this;
        return this.entities.filter(this.onScreenFilter);
    };

    app.systems.ColorSystem.prototype.placeWithinBounds = function () {
        var x = this.x;
        var y = this.y;

        var viewTransform = this.rootEntity.getPropertyType(Transform);

        var right = Math.min(this.right, viewTransform.width);
        var bottom = Math.min(this.bottom, viewTransform.height);

        x = right - this.width;
        y = bottom - this.height;

        this.x = Math.floor(x > 0 ? x : 0);
        this.y = Math.floor(y > 0 ? y : 0);
    };

    app.systems.ColorSystem.prototype.cacheEntities = function (game) {
        this.entities = this.rootEntity.filter(this.isRender);
    };

    app.systems.ColorSystem.prototype.activated = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
        this.loadImages();
        this.cacheEntities();
    };

    app.systems.ColorSystem.prototype.update = function () {
        this.draw();
    };


});