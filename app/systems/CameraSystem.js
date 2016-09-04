BASE.require([
    "app.properties.Render",
    "app.properties.Transform",
    "app.properties.Viewport"
], function () {

    BASE.namespace("app.systems");

    var Render = app.properties.Render;
    var Transform = app.properties.Transform;
    var Viewport = app.properties.Viewport;

    var emptyFn = function () { };

    app.systems.CameraSystem = function (canvas) {
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

    BASE.extend(app.systems.CameraSystem, Transform);

    app.systems.CameraSystem.prototype.getEnitiesViewport = function () {
        var camera = this;
        return this.entities.filter(this.onScreenFilter);
    };

    app.systems.CameraSystem.prototype.placeWithinBounds = function () {
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

    app.systems.CameraSystem.prototype.draw = function () {
        var camera = this;
        var entity = null;
        var intersection = null;
        var rect = null;
        var sprite = null;
        var context = this.context;
        var imageMap = this.imageMap;
        var image = null;

        this.placeWithinBounds();
        var entities = this.getEnitiesViewport();

        context.clearRect(0, 0, this.width, this.height);

        for (var x = 0 ; x < entities.length; x++) {
            entity = entities[x];
            rect = entity.getPropertyType(Transform);
            sprite = entity.getPropertyType(Render);

            if (sprite == null) {
                continue;
            }

            image = imageMap[sprite.path];

            if (image == null) {
                camera.loadImage(sprite.path);
                continue;
            }

            context.drawImage(
                image,
                sprite.x,
                sprite.y,
                sprite.width,
                sprite.height,
                rect.x - this.x,
                rect.y - this.y,
                rect.width,
                rect.height
                );
        }
    };

    app.systems.CameraSystem.prototype.findImagePaths = function () {
        return this.rootEntity.filter(this.isRender).map(function (entity) {
            var sprite = entity.getPropertyType(Render);
            return sprite.path;
        });
    };

    app.systems.CameraSystem.prototype.loadImage = function (path, callback) {
        callback = callback || emptyFn;
        var image = new Image(path);
        var camera = this;

        if (camera.imageMap[path] != null) {
            callback();
            return;
        }

        camera.imageMap[path] = image;
        image.onload = callback;
        image.src = path;
    };

    app.systems.CameraSystem.prototype.loadImages = function () {
        var paths = this.findImagePaths();
        var count = 0;
        var camera = this;

        paths.forEach(function (path) {
            camera.loadImage(path, function () {
                count++;

                if (count >= paths.length) {
                    camera.isReady = true;
                }
            });
        });
    };

    app.systems.CameraSystem.prototype.cacheEntities = function (game) {
        this.entities = this.rootEntity.filter(this.isRender);
    };

    app.systems.CameraSystem.prototype.activated = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
        this.loadImages();
        this.cacheEntities();
    };

    app.systems.CameraSystem.prototype.update = function () {
        this.draw();
    };


});