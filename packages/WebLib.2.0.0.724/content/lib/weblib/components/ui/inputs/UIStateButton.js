BASE.require([
    "jQuery",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.inputs");

    components.ui.inputs.UIStateButton = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var beforeHtml = $elem.html();
        var beforeClass = $elem.attr('class');

        var reset = function (duration) {
            setTimeout(function () {
                $elem.removeAttr('disabled');
                $elem.html(beforeHtml);
                $elem.attr('class', beforeClass);
            }, duration);
        }

        self.reset = function () {
            reset(0);
        }

        self.wait = function (future, options) {
            beforeHtml = $elem.html();
            beforeClass = $elem.attr('class');
            options = options || {};

            if (options.waiting) {
                if (options.waiting.text) {
                    $elem.text(options.waiting.text);
                }

                if (options.waiting.html) {
                    $elem.html(options.waiting.html);
                }

                if (options.waiting.classes) {
                    $elem.attr('class', options.waiting.classes.join(' '));
                }
            }

            $elem.attr('disabled', '');

            future.then(function () {
                if (options.success) {
                    if (options.success.text) {
                        $elem.text(options.success.text);
                    }
                    if (options.success.html) {
                        $elem.html(option.success.html);
                    }
                    if (options.success.classes) {
                        $elem.attr('class', option.success.classes.join(' '));
                    }
                    reset(3000);
                }
                else {
                    reset(0);
                }
            }).ifError(function () {
                if (options.error) {
                    if (options.error.text) {
                        $elem.text(options.error.text);
                    }

                    if (options.error.html) {
                        $elem.html(options.error.html);
                    }

                    if (options.error.classes) {
                        $elem.attr('class', options.error.classes.join(' '));
                    }
                    reset(3000);
                } else {
                    reset(0);
                }
               
            }).ifCanceled(function () {
                if (options.canceled) {
                    if (options.canceled.text) {
                        $elem.text(options.canceled.text);
                    }

                    if (options.canceled.html) {
                        $elem.html(options.canceled.html);
                    }

                    if (options.canceled.classes) {
                        $elem.attr('class', options.canceled.classes.join(' '));
                    }
                    reset(3000);
                } else {
                    reset(0);
                }
                
            }).ifTimedOut(function () {
                if (options.timedOut) {
                    if (options.timedOut.text) {
                        $elem.text(options.timedOut.text);
                    }

                    if (options.timedOut.html) {
                        $elem.html(options.timedOut.html);
                    }

                    if (options.timedOut.classes) {
                        $elem.attr('class', options.timedOut.classes.join(' '));
                    }
                    reset(3000);
                } else {
                    reset(0);
                }
            });
        }
    };
});