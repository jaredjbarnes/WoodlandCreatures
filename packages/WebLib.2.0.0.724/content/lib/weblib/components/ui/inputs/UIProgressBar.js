BASE.require([
    "jQuery",
    "BASE.async.Future",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.inputs");

    var Future = BASE.async.Future;

    components.ui.inputs.UIProgressBar = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var isPaused = true;
        var $bar = $(tags['bar']);

        self.setPercentage = function (value) {
            return $bar.transition(
                {
                    width: {
                        to: value + '%',
                        duration: 600,
                        easing: 'easeOutExpo'
                    }
                });
        }

        self.setClass = function (value) {
            $bar.removeAttr('class').addClass(value);
        }

        self.pause = function () {
            $elem.attr('paused', '');
        }

        self.start = function () {
            $elem.attr('active');
            $elem.removeAttr('paused');
        }

        self.stop = function () {
            $elem.removeAttr('active');
        }
    };
});