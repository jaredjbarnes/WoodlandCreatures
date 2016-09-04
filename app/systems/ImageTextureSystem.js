BASE.require([
    "app.properties.ImageTexture",
    "app.properties.Transform",
    "app.properties.Viewport"
], function () {

    BASE.namespace("app.systems");

    var ImageTexture = app.properties.ImageTexture;
    var Transform = app.properties.Transform;
    var Viewport = app.properties.Viewport;

    var emptyFn = function () { };

    var isImageTexture = function (entity) {
        return entity.hasPropertyByType(ImageTexture) && entity.hasPropertyByType(Transform);
    };

    app.renderers.ImageRenderer = function (canvas) {
        this.camera = null;
        this.context = null;
        this.imageMap = {};
        this.enabled = true;
    };

    app.renderers.ImageRenderer.prototype.draw = function () {
        var camera = this.camera;
        var entity = null;
        var intersection = null;
        var rect = null;
        var sprite = null;
        var context = this.context;
        var imageMap = this.imageMap;
        var image = null;

        var entities = this.getEntitiesOnViewport();

        context.clearRect(0, 0, this.width, this.height);

        for (var x = 0 ; x < entities.length; x++) {
            entity = entities[x];
            rect = entity.getPropertyType(Transform);
            sprite = entity.getPropertyType(ImageTexture);

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

    app.renderers.ImageRenderer.prototype.findImagePaths = function () {
        return this.rootEntity.filter(this.isImageTexture).map(function (entity) {
            var sprite = entity.getPropertyType(ImageTexture);
            return sprite.path;
        });
    };

    app.renderers.ImageRenderer.prototype.loadImage = function (path, callback) {
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

    app.renderers.ImageRenderer.prototype.loadImages = function () {
        var paths = this.findImagePaths();
        var count = 0;
        var self = this;

        paths.forEach(function (path) {
            self.loadImage(path, function () {
                count++;

                if (count >= paths.length) {
                    self.isReady = true;
                }
            });
        });
    };

    app.renderers.ImageRenderer.prototype.activated = function (camera) {
        this.camera = camera;
    };

    app.renderers.ImageRenderer.prototype.update = function (entities) {
        this.entities = entities.filter(this.isImageTexture);
        this.draw();
    };


});