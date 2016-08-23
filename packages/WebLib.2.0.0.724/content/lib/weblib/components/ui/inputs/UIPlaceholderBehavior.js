BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.inputs");

    components.ui.inputs.UIPlaceholderBehavior = function (elem) {
        $.support.placeholder = (function () {
            var i = document.createElement('input');
            return i.placeholder !== undefined;
        })();
        if (!$.support.placeholder) {
            var $elem = $(elem);
            $elem.val($elem.attr('placeholder')).css('color', '#AAAAAA');
            $elem.on('focus', function () {
                if ($elem.val() === $elem.attr('placeholder')) {
                    $elem.val('').css('color', '');
                }
            });
            $elem.on('blur', function () {
                if ($elem.val() === '') {
                    $elem.val($elem.attr('placeholder')).css('color', '#AAAAAA');
                }
            });
        }
    };
});