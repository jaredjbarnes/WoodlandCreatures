BASE.require([
    "BASE.web.animation.ElementAnimation"
], function () {

    var ElementAnimation = BASE.web.animation.ElementAnimation;

    BASE.namespace("components.material.animations");

    components.material.animations.createShrinkHeightAnimation = function (elem, duration) {
        var self = this;
        var duration = duration || 400;

        var height = elem.offsetHeight;
        var paddingTop = $(elem).css("paddingTop");
        var paddingBottom = $(elem).css("paddingBottom");
        var borderTopWidth = $(elem).css("borderTopWidth");
        var borderBottomWidth = $(elem).css("borderBottomWidth");

        elem.style.overflow = "hidden";

        var shrinkHeightAnimation = new ElementAnimation({
            target: elem,
            easing: "easeOutExpo",
            properties: {
                height: {
                    from: height + "px",
                    to: "0px"
                },
                paddingTop: {
                    from: paddingTop,
                    to: "0px"
                },
                paddingBottom: {
                    from: paddingBottom,
                    to: "0px"
                },
                borderTopWidth: {
                    from: borderTopWidth,
                    to: "0px"
                },
                borderBottomWidth: {
                    from: borderBottomWidth,
                    to: "0px"
                }
            },
            duration: duration
        });
        
        return shrinkHeightAnimation;
    };

});