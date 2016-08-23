BASE.require([
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {

    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var ElementAnimation = BASE.web.animation.ElementAnimation;


    BASE.namespace("components.material.animations");

    components.material.animations.createSpinInBottomAnimation = function (elem, toBottom, duration) {
        var self = this;
        var $elem = $(elem);
        var duration = duration || 400

        var fromBottom = '-' + ($elem.outerHeight() + 10) + 'px';

        var bottomAnimation = new ElementAnimation({
            target: elem,
            easing: "easeOutExpo",
            properties: {
                bottom: {
                    from: fromBottom,
                    to: toBottom
                }
            }
        });

        var spinAnimation = new ElementAnimation({
            target: elem,
            easing: "easeOutExpo",
            properties: {
                rotateZ: {
                    from: '0deg',
                    to: '360deg'
                }
            }
        })

        var timeline = new PercentageTimeline(duration);

        timeline.add({
            animation: bottomAnimation,
            startAt: 0,
            endAt: 1
        });
        timeline.add({
            animation: spinAnimation,
            startAt: 0.1,
            endAt: 1
        });

        return timeline;
    };

});