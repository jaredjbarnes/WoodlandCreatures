BASE.require([
    "BASE.web.animation.ElementAnimation"
], function () {
    var ElementAnimation = BASE.web.animation.ElementAnimation;

    BASE.namespace("components.material.animations");

    components.material.animations.createFadeInAnimation = function (elem, duration) {
        var self = this;
        var duration = duration || 400;

        var fadeInAnimation = new ElementAnimation({
            target: elem,
            easing: "easeOutQuad",
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            },
            duration: duration
        });

        return fadeInAnimation;
    };

});