BASE.require([
    'jQuery'
], function () {
    BASE.namespace('components.material.inputs');

    components.material.inputs.Select = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);

        var $select = $(tags['select']);
        $select = $select.children('select');
        var $fakeSelect = $(tags['fake-select']);
        var $fakeSelectArrow = $(tags['fake-select-arrow']);
        
        $fakeSelectArrow.addClass($elem.attr('arrow-class'));

        if ($select.length === 0) {
            throw new Error('A select must be supplied to the select component');
        }

        var populateFakeSelectText = function () {
            $fakeSelect.text($select.children(':selected').text());
        };

        self.getValue = function () {
            return $select.val();
        };

        self.setValue = function (value) {
            $select.val(value);
            populateFakeSelectText();
        };

        $elem.on('clickComponentFocus', function () {
            $select.focus();
        });

        $select.on('change', function () {
            populateFakeSelectText();
        });

        $select.on('focus', function () {
            $elem.trigger('componentFocus');
        });

        $select.on('blur', function () {
            $elem.trigger('componentBlur');
        });

        populateFakeSelectText();
    };
});