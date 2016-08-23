BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation"
], function () {

    var ElementAnimation = BASE.web.animation.ElementAnimation;

    BASE.namespace("components.material.feedback");

    components.material.feedback.PreloaderLine = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var lineA = tags["line-a"];
        var $lineA = $(lineA);
        var lineB = tags["line-b"];
        var $lineB = $(lineB);
        var easing = "easeOutQuad";
        var duration = 1300;
        var classColors = $elem.attr("color-classes") || "background-info background-danger background-warning background-success";
        var classColorsArray = classColors.split(" ");
        var colorCount = classColorsArray.length;

        var animations = [];
        var currentAnimation = null;

        var createScaleAnimation = function (target) {
            return new ElementAnimation({
                target: target,
                easing: easing,
                properties: {
                    scaleX: {
                        from: 0,
                        to: 1
                    }
                },
                duration: duration
            });
        };

        var init = function () {
            currentAnimation = animations[0];
        };

        var count = 0;

        classColorsArray.forEach(function (classColor, index) {

            var $currentLine = index % 2 === 0 ? $lineA : $lineB;
            var $nextLine = $currentLine === $lineA ? $lineB : $lineA;
            var currentLineColor = classColor;

            //animate in next color
            var animation = createScaleAnimation($currentLine[0]);

            animation.observe("start", function () {
                currentAnimation = animations[count];
                $currentLine.css("z-index", 2);
                $nextLine.css("z-index", 1);

                //set color
                $currentLine.removeAttr("class").addClass(currentLineColor);
            });

            animation.observe("end", function () {
                count++;
                if (count < animations.length) {
                    animations[count].restart();
                } else {
                    animations[0].restart();
                    count = 0;
                }
            });

            animations.push(animation);
        });

        self.play = function () {
            currentAnimation.play();
            return this;
        };

        self.pause = function () {
            currentAnimation.pause();
            return this;
        };

        self.stop = function () {
            currentAnimation.stop();
            return this;
        };

        self.restart = function () {
            self.stop();
            count = 0;
            $lineA.add($lineB).css({
                transform: "scaleX(0)"
            });
            currentAnimation = animations[0];
            currentAnimation.restart();
            return this;
        };

        init();
    };
});