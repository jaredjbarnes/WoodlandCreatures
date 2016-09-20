BASE.require([
    "app.properties.Sprite",
    "app.properties.ImageTexture"
], function () {
    BASE.namespace("app.systems");

    var Sprite = app.properties.Sprite;
    var ImageTexture = app.properties.ImageTexture;

    var isSprite = function (entity) {
        var sprites = entity.properties["sprite"];
        var imageTextures = entity.properties["image-texture"];

        return sprites && sprites.length > 0 && imageTextures && imageTextures.length > 0;
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
        var position = null;

        for (var x = 0 ; x < this.entities.length; x++) {
            entity = this.entities[x];
            sprite = entity.properties["sprite"][0];
            image = entity.properties["image-texture"][0];

            index = Math.floor(sprite.index);
            position = sprite.positions[index];

            if (position == null) {
                continue;
            }

            image.x = position.x;
            image.y = position.y;
            image.offset = position.offest || image.offset;

            sprite.index += (sprite.timeScale * 1);
            sprite.index = sprite.index >= sprite.positions.length ? 0 : sprite.index;
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