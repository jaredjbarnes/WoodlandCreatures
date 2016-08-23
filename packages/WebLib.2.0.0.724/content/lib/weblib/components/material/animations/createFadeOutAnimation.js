BASE.require([
    "BASE.web.animation.ElementAnimation"
], function () {
    var ElementAnimation = BASE.web.animation.ElementAnimation;

    BASE.namespace("components.material.animations");

    components.material.animations.createFadeOutAnimation = function (elem, duration) {
        var self = this;
        var duration = duration || 400;

        var fadeOutAnimation = new ElementAnimation({
            target: elem,
            easing: "easeOutQuad",
            properties: {
                opacity: {
                    from: 1,
                    to: 0
                }
            },
            duration: duration
        });

        return fadeOutAnimation;
    };

});