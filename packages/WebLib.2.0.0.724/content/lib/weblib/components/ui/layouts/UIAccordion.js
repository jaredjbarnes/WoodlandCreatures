BASE.require([
    "jQuery",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIAccordion = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $header = $(tags['header']);
        var $content = $(tags['content']);
        var maxHeight = 400;

        self.show = function () {
            $elem.trigger({
                type: 'showStart'
            });
            $content.removeClass('hide').transition({
                'max-height': {
                    to: maxHeight,
                    duration: 300,
                    easing: 'ease'
                }
            }).then(function () {
                $content.addClass('overflow-auto').removeClass('overflow-hidden').children().css({ width: '' });
                $elem.trigger({
                    type: 'showEnd'
                });
            });     
        }

        self.hide = function () {
            $elem.trigger({
                type: 'hideStart'
            });
            $content.removeClass('overflow-auto').addClass('overflow-hidden').children().css({ width: '100%' });
            $content.transition({
                'max-height': {
                    to: 0,
                    duration: 300,
                    easing: 'ease'
                }
            }).then(function () {
                $elem.trigger({
                    type: 'hideEnd'
                });
                $content.addClass('hide');
            });
        }

        self.toggle = function () {
            if (self.isVisible()) {
                self.hide();
            }
            else {
                self.show();
            }
        }

        self.setMaxHeight = function (value) {
            maxHeight = value;
        }

        self.isVisible = function () {
            return $content.is(':visible');
        }

    };
});