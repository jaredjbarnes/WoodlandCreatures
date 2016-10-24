BASE.require([
    "BASE.web.animation.easings"
], function () {

    var easings = BASE.web.animation.easings;

    BASE.namespace("app.systems");

    app.systems.AnimationSystem = function () {
        this.game = null;
        this.isReady = true;
        this.entities = [];
        this.currentTime = 0;
    };

    app.systems.AnimationSystem.prototype.updateAnimations = function (entity) {
        var animation;
        var animations = entity.getProperties("animation");
        var length = animations.length;
        var timer = this.game.timer;
        var currentTime = this.currentTime;
        var onIteration;
        var overlap;
        var change;

        for (var x = 0 ; x < length ; x++) {
            animation = animations[x];
            change = animation.endValue - animation.startValue;

            if (animation.endValue === 0 || animation.duration === 0) {
                animation.currentValue = animation.endValue;
                return;
            }

            onIteration = Math.floor((currentTime - animation.startTime) / animation.duration);
            // Handle repeat
            if (onIteration < animation.repeat) {

                //Handle directions.
                if (animation.repeatDirection === 0) {
                    overlap = (currentTime - animation.startTime) % animation.duration;
                    easing = easings[animation.easing] || easings.linear;
                    animation.currentValue = easing(overlap, animation.startValue, change, animation.duration);
                } else {

                    // If dividable by 2 then its going forward.
                    if (onIteration % 2 === 0) {
                        overlap = (currentTime - animation.startTime) % animation.duration;
                        easing = easings[animation.easing] || easings.linear;
                        animation.currentValue = easing(overlap, animation.startValue, change, animation.duration);
                    } else {
                        overlap = animation.duration - ((currentTime - animation.startTime) % animation.duration);
                        easing = easings[animation.easing] || easings.linear;
                        animation.currentValue = easing(overlap, animation.startValue, change, animation.duration);
                    }

                }
            } else {

                if (animation.repeatDirection === 0) {
                    animation.currentValue = animation.endValue;
                } else {
                    if (onIteration % 2 === 0) {
                        animation.currentValue = animation.startValue;
                    } else {
                        animation.currentValue = animation.endValue;
                    }
                }

            }
        }

        animation.iterations = onIteration;
        animation.progress = animation.currentValue / (animation.endValue - animation.startValue)
    };

    app.systems.AnimationSystem.prototype.update = function () {
        var entity;
        var entities = this.entities;
        var length = entities.length;

        this.currentTime = this.game.timer.now();

        for (var x = 0 ; x < length ; x++) {
            this.updateAnimations(entities[x]);
        }
    };

    app.systems.AnimationSystem.prototype.activated = function (game) {
        var self = this;
        this.game = game;
        this.game.stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });
    };

    app.systems.AnimationSystem.prototype.deactivated = function () {
        this.game = null;
        this.entities = [];
    };

    app.systems.AnimationSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["animation"])) {
            this.entities.push(entity);
        }
    };

    app.systems.AnimationSystem.prototype.entityRemoved = function (entity) {
        if (entity.hasProperties(["animation"])) {
            var index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };

    app.systems.AnimationSystem.prototype.propertyAdded = function (entity, property) {
        if (property.type === "animation") {
            var index = this.entities.indexOf(entity);
            if (index === -1) {
                this.entities.push(entity);
            }
        }
    };

    app.systems.AnimationSystem.prototype.propertyRemoved = function (entity, property) {
        if (property.type === "animation") {
            var animations = entity.getProperties("animation");

            if (animations.length === 1) {
                var index = this.entities.indexOf(entity);
                if (index === -1) {
                    this.entities.splice(index, 1);
                }
            }
        }
    };

});