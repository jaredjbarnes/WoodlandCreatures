BASE.require([
], function () {
    BASE.namespace("app.systems");

    var isSprite = function (entity) {
        return entity.hasProperties(["sprite", "image-texture"]);
    };

    app.systems.SpriteSystem = function () {
        this.game = null;
        this.entities = [];
        this.isReady = true;
    };

    app.systems.SpriteSystem.prototype.cacheEntities = function () {
        this.entities = this.game.stage.filter(isSprite);
    };

    app.systems.SpriteSystem.prototype.update = function () {
        var entity = null;
        var sprite = null;
        var index = 0;
        var newImageTexture = null;

        for (var x = 0 ; x < this.entities.length; x++) {
            entity = this.entities[x];
            sprite = entity.properties["sprite"][0];
            imageTexture = entity.properties["image-texture"][0];

            index = Math.floor(sprite.index);
            newImageTexture = sprite.images[index];

            if (newImageTexture == null) {
                continue;
            }

            Object.keys(newImageTexture).forEach(function (key) {
                if (key === "type") {
                    return;
                }
                imageTexture[key] = newImageTexture[key];
            });

            sprite.index += (sprite.timeScale * 1);
            sprite.index = sprite.index >= sprite.images.length ? 0 : sprite.index;
        }
    };

    app.systems.SpriteSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["sprite", "image-texture"])) {
            this.entities.push(entity);
        }
    };

    app.systems.SpriteSystem.prototype.entityRemoved = function (entity) {
        var index = this.entities.indexOf(entity);

        if (index > -1) {
            this.entities.splice(index, 1);
        }
    };

    app.systems.SpriteSystem.prototype.propertyAdded = function (entity, property) {
        if (property.type === "state" || property.type === "image-texture") {
            this.entityAdded(entity);
        }
    };

    app.systems.SpriteSystem.prototype.propertyRemoved = function (entity, property) {
        if (property.type === "state" || property.type === "image-texture") {
            var index = this.entities.indexOf(entity);

            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.SpriteSystem.prototype.activated = function (game) {
        this.game = game;
        this.cacheEntities();
    };

    app.systems.SpriteSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };
});