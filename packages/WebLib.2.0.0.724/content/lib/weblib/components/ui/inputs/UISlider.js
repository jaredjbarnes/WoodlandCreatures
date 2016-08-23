BASE.require.loader.setObject("jQuery.fn.noUiSlider", "/libcdn/plugins/noUiSlider/noUiSlider.js");

BASE.require([
    'jQuery',
    'jQuery.fn.noUiSlider',
    'Element.prototype.region'
], function () {

    BASE.namespace('components.ui.inputs');

    components.ui.inputs.UISlider = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        $elem.find('.ui-slider-item').not(':first-child, :last-child').wrapInner('<span class="ui-slider-content-span">');
        $last = $elem.find('.ui-slider-item:last-child').css('float', 'right');
        $last.appendTo($last.prev());

        var $uiSliderItems = $elem.find('.ui-slider-items-container > .ui-slider-item');

        var step = 100 / ($uiSliderItems.length);
        $uiSliderItems.css('width', step + '%');

        var $childSpans = $uiSliderItems.children('span.ui-slider-content-span');
        
        $elem.on('enteredView', function () {
            removeText();

            $(window).on('resize', function () {
                removeText();
            });

            function removeText () {
                if ($(this).width() <= 767) {
                    $('.ui-slider-item').add($childSpans).contents().filter(function () {
                        return this.nodeType == 3;
                    }).wrap('<span class="hide">');
                }
                else {
                    $('.ui-slider-item span.hide').contents().unwrap();
                }
                $childSpans.each(function () {
                    var $this = $(this);
                    $this.css('margin-left', '-' + $this.width() / 2 + 'px');
                });
            }
        });
        
        $elem.find('.ui-slider-item').each(function (i) {
            $(this).data('position', step * i);
        });

        var $noUiSlider = $elem.find('.no-ui-slider');
        $noUiSlider.noUiSlider({
            range: [0, 100],
            start: 0,
            connect: 'lower',
            step: step,
            slide: function () {
                $elem.trigger({
                    type: 'slide',
                    value: self.getValue()
                });
            },
            handles: 1
        }).on('change', function (event) {
            event.stopPropagation();
            event.preventDefault();
            $elem.trigger({
                type: 'change',
                value: self.getValue()
            });
        });

        self.setValue = function (updateValue) {
            var oldSelfValue = self.getValue()
            $noUiSlider.val(($('.ui-slider-item[value="' + updateValue + '"]').data('position')));
            if (oldSelfValue !== self.getValue()) {
                $elem.trigger({
                    type: 'change',
                    value: self.getValue()
                });
            }
        };

        self.getValue = function () {
            var noUiSliderVal = $noUiSlider.val();
            var result = $elem.find('.ui-slider-item').filter(function () {
                return parseFloat($(this).data('position')).toFixed(2) === noUiSliderVal;
            }).attr('value');
            if (typeof result === 'undefined') {
                result = null
            }
            return result;
        };
    };
});