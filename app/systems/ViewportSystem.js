BASE.require([
    "app.Rect",
    "app.properties.Transform",
    "app.properties.Viewport"
], function () {

    BASE.namespace("app.systems");

    var Transform = app.properties.Transform;
    var Viewport = app.properties.Viewport;
    var Rect = app.Rect;

    var emptyFn = function () { };

    var isTransformable = function (entity) {
        return entity.hasComponentByType(Transform);
    };

    app.systems.ViewportSystem = function () {
        var self = this;

        Rect.call(this);

        this.game = null;
        this.rootEntity = null;
        this.isReady = true;

        this.onScreenFilter = function (entity) {
            var transform = entity.getPropertyByType(Transform);
            var viewport = entity.getPropertyByType(Viewport);
            var intersection = transform.getIntersection(self);

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

    };

    BASE.extend(app.systems.ViewportSystem, Rect);

    app.systems.ViewportSystem.prototype.getEntitiesOnViewport = function () {
        return this.rootEntity.filter(isTransformable).filter(this.onScreenFilter);
    };

    app.systems.ViewportSystem.prototype.placeWithinBounds = function () {
        var x = this.x;
        var y = this.y;

        var entityTransform = this.rootEntity.getPropertyType(Transform);

        var right = Math.min(this.right, entityTransform.width);
        var bottom = Math.min(this.bottom, entityTransform.height);

        x = right - this.width;
        y = bottom - this.height;

        this.x = Math.floor(x > 0 ? x : 0);
        this.y = Math.floor(y > 0 ? y : 0);
    };

    app.systems.ViewportSystem.prototype.activated = function (game) {
        this.game = game;
        this.rootEntity = game.rootEntity;
    };

    app.systems.ViewportSystem.prototype.update = function () {
        this.placeWithinBounds();
    };

});