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

    app.systems.ImageTextureSystem = function (canvas) {
        var camera = this;

        Transform.call(this);
        this.game = null;
        this.rootEntity = null;
        this.width = canvas.width;
        this.height = canvas.height;
        this.isReady = false;
        this.context = canvas.getContext("2d");
        this.imageMap = {};

        this.isOnViewport = function (entity) {
            var viewport = entity.getPropertyByType(Viewport);
            return viewport == null ? false : viewport.isWithinBounds;
        };

        this.isImageTexture = function (entity) {
            return entity.hasPropertyByType(ImageTexture) && entity.hasPropertyByType(Transform);
        };
    };

    BASE.extend(app.systems.ImageTextureSystem, Transform);

    app.systems.ImageTextureSystem.prototype.getEnitiesOnViewport = function () {
        var camera = this;
        return this.rootEntity.filter(this.isImageTexture).filter(this.isOnViewport);
    };

    app.systems.ImageTextureSystem.prototype.draw = function () {
        var camera = this;
        var entity = null;
        var intersection = null;
        var rect = null;
        var image = null;
        var context = this.context;
        var imageMap = this.imageMap;
        var imageTexture = null;

        var entities = this.getEnitiesOnViewport();

        context.clearRect(0, 0, this.width, this.height);

        for (var x = 0 ; x < entities.length; x++) {
            entity = entities[x];
            transform = entity.getPropertyByType(Transform);
            imageTexture = entity.getPropertyByType(ImageTexture);
            image = imageMap[imageTexture.path];

            if (image == null) {
                camera.loadImage(imageTexture.path);
                continue;
            }

            context.drawImage(
                image,
                imageTexture.x,
                imageTexture.y,
                imageTexture.width,
                imageTexture.height,
                transform.x - this.x,
                transform.y - this.y,
                transform.width,
                transform.height
                );
        }
    };

    app.systems.ImageTextureSystem.prototype.findImagePaths = function () {
        return this.rootEntity.filter(this.isImageTexture).map(function (entity) {
            var image = entity.getPropertyByType(ImageTexture);
            return image.path;
        });
    };

    app.systems.ImageTextureSystem.prototype.loadImage = function (path, callback) {
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

    app.systems.ImageTextureSystem.prototype.loadImages = function () {
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

    app.systems.ImageTextureSystem.prototype.activated = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
        this.loadImages();
    };

    app.systems.ImageTextureSystem.prototype.update = function () {
        this.draw();
    };


});