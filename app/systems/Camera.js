BASE.require([
    "app.components.Sprite",
    "app.components.Rect"
], function () {

    BASE.namespace("app.systems");

    var Sprite = app.components.Sprite;
    var Rect = app.components.Rect;
    var emptyFn = function () { };

    app.systems.Camera = function (canvas) {
        Rect.call(this);

        var camera = this;

        this.game = null;
        this.rootEntity = null;
        this.width = canvas.width;
        this.height = canvas.height;
        this.isReady = false;
        this.context = canvas.getContext("2d");
        this.imageMap = {};

        this.onScreenFilter = function (entity) {
            var rect = entity.getComponentByType(Rect);
            var sprite = entity.getComponentByType(Sprite);

            if (rect == null || sprite == null) {
                return false;
            }

            var intersection = rect.getIntersection(camera);

            return intersection == null ? false : true;
        };

        this.isRenderable = function (entity) {
            var sprite = entity.getComponentByType(Sprite);

            if (sprite == null) {
                return false;
            }

            return true;
        };
    };

    app.systems.Camera.prototype.getEnitiesOnScreen = function () {
        var camera = this;
        return this.rootEntity.filter(this.onScreenFilter);
    };

    app.systems.Camera.prototype.placeWithinBounds = function () {
        var x = this.x;
        var y = this.y;

        var viewRect = this.rootEntity.getComponentByType(Rect);

        var right = Math.min(this.right, viewRect.width);
        var bottom = Math.min(this.bottom, viewRect.height);

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
        var source = null;
        var imageMap = this.imageMap;
        var image = null;

        this.placeWithinBounds();
        var entities = this.getEnitiesOnScreen();

        for (var x = 0 ; x < entities; x++) {
            entity = entities[x];
            rect = entity.getComponentByType(Rect);
            sprite = entity.getComponentByType(Sprite);
            source = sprite.source;
            image = imageMap[source.path];

            if (image == null) {
                camera.loadImage(source.path);
                continue;
            }

            intersection = rect.getIntersection(camera);

            context.drawImage(
                image,
                source.x,
                source.y,
                source.width,
                source.height,
                rect.x,
                rect.y,
                rect.width,
                rect.height
                );
        }
    };

    app.systems.Camera.prototype.findImagePaths = function () {
        return this.rootEntity.filter(this.isRenderable).map(function (entity) {
            var sprite = entity.getComponentByType(Sprite);
            return sprite.source.path;
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

    app.systems.Camera.prototype.init = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
        this.loadImages();
    };

    app.systems.Camera.prototype.update = function () {
        this.draw();
    };

    BASE.extend(app.systems.Camera, Rect);
});