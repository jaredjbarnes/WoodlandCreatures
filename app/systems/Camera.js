BASE.require([
    "app.components.Renderable",
    "app.components.Transform"
], function () {

    BASE.namespace("app.systems");

    var SpriteImage = app.components.Renderable;
    var Transform = app.components.Transform;
    var emptyFn = function () { };

    app.systems.Camera = function (canvas) {
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
            var rect = entity.getComponentByType(Transform);
            var sprite = entity.getComponentByType(SpriteImage);

            if (rect == null || sprite == null) {
                return false;
            }

            var intersection = rect.getIntersection(camera);

            return intersection == null ? false : true;
        };

        this.isRenderable = function (entity) {
            return  entity.hasComponentByType(SpriteImage);
        };
    };

    BASE.extend(app.systems.Camera, Transform);

    app.systems.Camera.prototype.getEnitiesOnScreen = function () {
        var camera = this;
        return this.entities.filter(this.onScreenFilter);
    };

    app.systems.Camera.prototype.placeWithinBounds = function () {
        var x = this.x;
        var y = this.y;

        var viewTransform = this.rootEntity.getComponentByType(Transform);

        var right = Math.min(this.right, viewTransform.width);
        var bottom = Math.min(this.bottom, viewTransform.height);

        x = right - this.width;
        y = bottom - this.height;

        this.x = Math.floor(x > 0 ? x : 0);
        this.y = Math.floor(y > 0 ? y : 0);
    };

    app.systems.Camera.prototype.draw = function () {
        var camera = this;
        var entity = null;
        var intersection = null;
        var rect = null;
        var sprite = null;
        var context = this.context;
        var imageMap = this.imageMap;
        var image = null;

        this.placeWithinBounds();
        var entities = this.getEnitiesOnScreen();

        context.clearRect(0, 0, this.width, this.height);

        for (var x = 0 ; x < entities.length; x++) {
            entity = entities[x];
            rect = entity.getComponentByType(Transform);
            sprite = entity.getComponentByType(SpriteImage);
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

    app.systems.Camera.prototype.findImagePaths = function () {
        return this.rootEntity.filter(this.isRenderable).map(function (entity) {
            var sprite = entity.getComponentByType(SpriteImage);
            return sprite.path;
        });
    };

    app.systems.Camera.prototype.loadImage = function (path, callback) {
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

    app.systems.Camera.prototype.loadImages = function () {
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

    app.systems.Camera.prototype.cacheEntities = function (game) {
        this.entities = this.rootEntity.filter(this.isRenderable);
    };

    app.systems.Camera.prototype.activated = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
        this.loadImages();
        this.cacheEntities();
    };

    app.systems.Camera.prototype.update = function () {
        this.draw();
    };


});