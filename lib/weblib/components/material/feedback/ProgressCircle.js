BASE.require([
    "jQuery",
    "BASE.web.animation.Animation"
], function () {

    var Animation = BASE.web.animation.Animation;
    var TOP_OF_CIRCLE = 1.5;
    var PERCENTAGE_TO_RADIAN_FACTOR = 50;
    var emptyFn = function () { };

    BASE.namespace("components.material.feedback");

    var createPercentageAnimation = function (target, easing, duration) {
        var startAnimation;

        startAnimation = new Animation({
            target: target,
            properties: {
                endRadian: {
                    from: target.endRadian,
                    to: target.toRadian
                }
            },
            easing: easing,
            duration: duration
        });

        return startAnimation;
    };

    components.material.feedback.ProgressCircle = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var canvas = tags['canvas'];
        var context = canvas.getContext('2d');

        var properties = {
            endRadian: TOP_OF_CIRCLE
        };

        var defaultEasing = $elem.attr('easing') || 'easeOutExpo';
        var defaultDuration = parseInt($elem.attr('duration'), 10) || 3000;
        var defaultStroke = parseInt($elem.attr('stroke'), 10) || 4;
        var defaultStrokeStyle =$elem.attr('stroke-style') || '#0094ff';

        self.setPercentageAsync = function (percentage, options) {
            var options = options || {};
            var width = elem.offsetWidth;
            var height = elem.offsetHeight;

            var originX = width / 2;
            var originY = height / 2;

            var diameter = height > width ? width : height;

            canvas.width = width;
            canvas.height = height;

            var duration = typeof options.duration === 'number' ? options.duration : defaultDuration;
            var stroke = typeof options.stroke === 'number' ? options.stroke : defaultStroke;
            var strokeStyle = typeof options.strokeStyle === 'string' ? options.strokeStyle : defaultStrokeStyle;
            var easing = typeof options.easing === 'string' ? options.easing : defaultEasing;

            var tempPercentage = 0;
            var radius = (diameter / 2) - stroke;
            radius = radius < 0 ? 0 : radius;

            if (typeof percentage === 'number') {
                properties.toRadian = percentage / PERCENTAGE_TO_RADIAN_FACTOR + (TOP_OF_CIRCLE);
                var percentageAnimation = createPercentageAnimation(properties, easing, duration);

                percentageAnimation.observe("tick", function () {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.strokeStyle = strokeStyle;

                    context.beginPath();
                    context.lineWidth = stroke;
                    context.lineCap = "square";

                    context.arc(originX, originY, radius, TOP_OF_CIRCLE * Math.PI, properties.endRadian * Math.PI);
                    context.stroke();

                    var currentPercentage = Math.floor(((properties.endRadian - TOP_OF_CIRCLE) / 2) * 100);
                    if (tempPercentage !== currentPercentage) {
                        self.onPercentageChange(currentPercentage);
                        tempPercentage = currentPercentage;
                    }
                });
 
                return percentageAnimation.playToEndAsync();
            } else {
                throw new Error('The percentage must be a number');
            }
        };

        self.setDecimalFractionAsync = function (percentage, options) {
            if (typeof percentage === 'number') {
                percentage = percentage * 100;
                return self.setPercentageAsync(percentage, options);
            } else {
                throw new Error('The decimal fraction must be a number');
            }
        };

        self.onPercentageChange = emptyFn;
    };
});