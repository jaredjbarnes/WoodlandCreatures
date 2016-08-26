BASE.require([
    "app.components.Sprite",
    "app.components.Renderable"
], function () {
    BASE.namespace("app.systems");

    var Sprite = app.components.Sprite;
    var Image = app.components.Renderable;

    var isSprite = function (entity) {
        return entity.hasComponentByType(Sprite);
    };

    app.systems.SpriteSystem = function () {
        this.game = null;
        this.entities = [];
        this.isReady = true;
    };

    app.systems.SpriteSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isSprite);
    };

    app.systems.SpriteSystem.prototype.update = function () {
        var entity = null;
        var sprite = null;
        var index = 0;
        var position = null;

        for (var x = 0 ; x < this.entities.length; x++) {
            entity = this.entities[x];
            sprite = entity.getComponentByType(Sprite);
            image = entity.getComponentByType(Image);

            index = Math.floor(sprite.index);

            position = sprite.positions[index];

            image.x = position.x;
            image.y = position.y;

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