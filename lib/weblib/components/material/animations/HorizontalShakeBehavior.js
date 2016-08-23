BASE.require([
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {

    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var ElementAnimation = BASE.web.animation.ElementAnimation;


    BASE.namespace("components.material.animations");

    components.material.animations.HorizontalShakeBehavior = function (elem) {
        var self = this;
        var duration = 400;

        var animation1 = new ElementAnimation({
            target: elem,
            easing: "easeOutExpo",
            properties: {
                translateX: {
                    from: "0%",
                    to: "5%"
                }
            }
        });

        var animation2 = new ElementAnimation({
            target: elem,
            easing: "easeOutElastic",
            properties: {
                translateX: {
                    from: "5%",
                    to: "0%"
                }
            }
        });


        var timeline = new PercentageTimeline(duration);
        timeline.add({
            animation: animation1,
            startAt: 0,
            endAt: 0.1
        }, {
            animation: animation2,
            startAt: 0.1,
            endAt: 1
        });

        self.shake = function () {
            timeline.restart();
        };

    };

});