BASE.require([
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {

    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var ElementAnimation = BASE.web.animation.ElementAnimation;


    BASE.namespace("components.legacy");

    components.legacy.LegacyHorizontalShakeBehavior = function (elem) {
        var self = this;
        var duration = 400;

        var animation1 = new ElementAnimation({
            target: elem,
            easing: "easeOutExpo",
            properties: {
                left: {
                    from: "0px",
                    to: "20px"
                }
            }
        });

        var animation2 = new ElementAnimation({
            target: elem,
            easing: "easeOutElastic",
            properties: {
                left: {
                    from: "20px",
                    to: "0px"
                },
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